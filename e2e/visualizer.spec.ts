import { test, expect } from '@playwright/test';

test.describe('PathScope Algorithm Visualizer - 50% Milestone Verification Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to visualizer workbench
    await page.goto('/visualizer');
    // Ensure the page and graph engine load
    await expect(page.locator('role=region[name="Algorithm playback controls"]')).toBeVisible({
      timeout: 15000,
    });
  });

  test('1. Load BFS preset, step forward and reach a correct result', async ({ page }) => {
    // Select BFS algorithm
    const bfsButton = page.getByRole('button', { name: /Breadth-First Search/i });
    await bfsButton.click();

    // Select the "BFS vs Dijkstra Tradeoff" benchmark preset if not already loaded
    const presetSelect = page.locator('#graph-preset-select');
    await presetSelect.selectOption('bfs-vs-dijkstra-tradeoff');

    // Step forward using playback controls
    const nextBtn = page.getByRole('button', { name: 'Next step' });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Move to the final step using keyboard shortcut End
    await page.keyboard.press('End');

    // Switch to Result tab
    await page.locator('#tab-result').click();

    // In BFS, hop count for direct edge A-D is 1 (BFS chooses minimum hops)
    const resultPanel = page.locator('#panel-result');
    await expect(resultPanel.getByText('Optimal path found')).toBeVisible();
    await expect(resultPanel.getByText('Hops', { exact: true })).toBeVisible();
    await expect(resultPanel.getByText('Minimum hops')).toBeVisible();
  });

  test('2. Load Dijkstra preset and verify the cost-7 path', async ({ page }) => {
    // Select Dijkstra algorithm
    const dijkstraButton = page.getByRole('button', { name: /Dijkstra's Algorithm/i });
    await dijkstraButton.click();

    // Select the "BFS vs Dijkstra Tradeoff" benchmark preset
    const presetSelect = page.locator('#graph-preset-select');
    await presetSelect.selectOption('bfs-vs-dijkstra-tradeoff');

    // Jump to the final step using keyboard shortcut End
    await page.keyboard.press('End');

    // Select the Result tab
    await page.locator('#tab-result').click();

    // In the tradeoff graph: A->D costs 18 (1 hop), but A->B->C->D costs 2+2+3 = 7
    // Dijkstra must find the cost 7 path
    const resultPanel = page.locator('#panel-result');
    await expect(resultPanel.getByText('Optimal path found')).toBeVisible();
    await expect(resultPanel.locator('text=7').first()).toBeVisible();
    await expect(resultPanel.getByText('Vertex A')).toBeVisible();
    await expect(resultPanel.getByText('Vertex B')).toBeVisible();
    await expect(resultPanel.getByText('Vertex C')).toBeVisible();
    await expect(resultPanel.getByText('Vertex D')).toBeVisible();
  });

  test('3. Load Textbook Dijkstra preset and verify reachability to vertex F', async ({ page }) => {
    // Select Dijkstra algorithm
    const dijkstraButton = page.getByRole('button', { name: /Dijkstra's Algorithm/i });
    await dijkstraButton.click();

    // Select the textbook-dijkstra preset
    const presetSelect = page.locator('#graph-preset-select');
    await presetSelect.selectOption('textbook-dijkstra');
    await presetSelect.blur();

    // Press End to reach the final step
    await page.keyboard.press('End');

    // Select Result tab
    await page.locator('#tab-result').click();

    // Confirm optimal path to F is found
    const resultPanel = page.locator('#panel-result');
    await expect(resultPanel.getByText('Optimal path found')).toBeVisible();
    await expect(resultPanel.getByText('Vertex F')).toBeVisible();
  });

  test('4. Edit an edge weight and confirm snapshots regenerate', async ({ page }) => {
    // Select Dijkstra
    await page.getByRole('button', { name: /Dijkstra's Algorithm/i }).click();

    // Load Tradeoff preset
    await page.locator('#graph-preset-select').selectOption('bfs-vs-dijkstra-tradeoff');

    // Initial result is cost 7 (path A-B-C-D) because A-D is cost 18
    // Find the edge weight button for 18
    const weightButton18 = page.getByRole('button', { name: /Edge weight 18/i });
    await expect(weightButton18).toBeVisible();
    await weightButton18.click();

    // The native dialog should appear
    const dialog = page.locator('dialog#edge-weight-dialog');
    await expect(dialog).toBeVisible();

    // Edit weight from 18 to 1
    const weightInput = page.locator('#edge-weight-input');
    await weightInput.fill('1');

    // Save weight
    await page.getByRole('button', { name: /Save Weight/i }).click();
    await expect(dialog).not.toBeVisible();

    // Press End to jump to final step
    await page.keyboard.press('End');

    // View Result tab
    await page.locator('#tab-result').click();

    // With edge A-D cost 1, the new shortest path is direct A->D with cost 1
    const resultPanel = page.locator('#panel-result');
    await expect(resultPanel.getByText('Optimal path found')).toBeVisible();
    await expect(resultPanel.locator('text=1').first()).toBeVisible();
  });

  test('5. Open and close the edge dialog by keyboard', async ({ page }) => {
    const weightButton = page.locator('button[aria-label*="Edge weight"]').first();
    await expect(weightButton).toBeVisible();

    // Focus and press Enter
    await weightButton.focus();
    await page.keyboard.press('Enter');

    // Verify dialog opened and input is focused
    const dialog = page.locator('dialog#edge-weight-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#edge-weight-input')).toBeFocused();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Focus should be restored to the triggering button
    await expect(weightButton).toBeFocused();
  });

  test('6. Navigate inspector tabs using arrow keys and Home/End', async ({ page }) => {
    const tabExplanation = page.locator('#tab-explanation');
    const tabPseudocode = page.locator('#tab-pseudocode');
    const tabData = page.locator('#tab-data');
    const tabResult = page.locator('#tab-result');

    // Click Explanation tab to focus it
    await tabExplanation.click();
    await expect(tabExplanation).toHaveAttribute('aria-selected', 'true');

    // Arrow Right -> Pseudocode
    await page.keyboard.press('ArrowRight');
    await expect(tabPseudocode).toBeFocused();
    await expect(tabPseudocode).toHaveAttribute('aria-selected', 'true');

    // Arrow Right -> Data
    await page.keyboard.press('ArrowRight');
    await expect(tabData).toBeFocused();
    await expect(tabData).toHaveAttribute('aria-selected', 'true');

    // Arrow Right -> Result
    await page.keyboard.press('ArrowRight');
    await expect(tabResult).toBeFocused();
    await expect(tabResult).toHaveAttribute('aria-selected', 'true');

    // Home -> Explanation
    await page.keyboard.press('Home');
    await expect(tabExplanation).toBeFocused();
    await expect(tabExplanation).toHaveAttribute('aria-selected', 'true');

    // End -> Result
    await page.keyboard.press('End');
    await expect(tabResult).toBeFocused();
    await expect(tabResult).toHaveAttribute('aria-selected', 'true');
  });

  test('7. Test mobile drawers at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Open Mobile Config Drawer
    const configBtn = page.getByRole('button', { name: 'Graph controls' });
    await expect(configBtn).toBeVisible();
    await configBtn.click();

    const configDrawer = page.locator('#mobile-config-drawer');
    await expect(configDrawer).toBeVisible();

    // Press Escape to dismiss drawer
    await page.keyboard.press('Escape');
    await expect(configBtn).toBeFocused();

    // Open Step Inspector Drawer
    const inspectorBtn = page.getByRole('button', { name: 'Step inspector' });
    await expect(inspectorBtn).toBeVisible();
    await inspectorBtn.click();

    const inspectorDrawer = page.locator('#mobile-inspector-drawer');
    await expect(inspectorDrawer).toBeVisible();

    // Press Escape to dismiss drawer
    await page.keyboard.press('Escape');
    await expect(inspectorBtn).toBeFocused();
  });

  test('8. Confirm no horizontal page overflow across viewports', async ({ page }) => {
    const viewports = [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(
        hasHorizontalOverflow,
        `Horizontal overflow detected at viewport ${vp.width}x${vp.height}`
      ).toBe(false);
    }
  });

  test('9. Confirm all four inspector tabs remain reachable at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const tabExplanation = page.locator('#tab-explanation');
    const tabPseudocode = page.locator('#tab-pseudocode');
    const tabData = page.locator('#tab-data');
    const tabResult = page.locator('#tab-result');

    await expect(tabExplanation).toBeVisible();
    await expect(tabPseudocode).toBeVisible();
    await expect(tabData).toBeVisible();
    await expect(tabResult).toBeVisible();

    // Click Result tab; verify Explanation is not scrolled off-screen
    await tabResult.click();
    await expect(tabExplanation).toBeVisible();
    await expect(tabResult).toHaveAttribute('aria-selected', 'true');
  });

  test('10. Verify light and dark theme readability', async ({ page }) => {
    // Find theme toggle button in header
    const themeToggle = page.locator('button[aria-label*="Switch to dark mode"], button[aria-label*="Switch to light mode"]');
    await expect(themeToggle).toBeVisible();

    // Click toggle
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await themeToggle.click();

    const switchedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(switchedTheme).not.toBe(initialTheme);

    // Switch back
    await themeToggle.click();
    const revertedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(revertedTheme).toBe(initialTheme);
  });
});
