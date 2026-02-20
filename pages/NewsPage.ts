import { Page, Locator, expect } from "@playwright/test";

export class NewsPage {
        readonly page: Page;
        readonly mainMenu: Locator;

        constructor(page: Page) {
                this.page = page;
                this.mainMenu = page.locator('.mainMenu', { hasText: 'News & Reviews' });
        }

        async openNewsAndTopStories() {
                try {
                        await this.mainMenu.hover();
                        const stories = this.page.locator('li').getByText('News & Top stories');
                        await stories.click();
                        await this.page.waitForLoadState('domcontentloaded');
                        const newsHead = this.page.locator('h1').first();
                        await expect(newsHead).toBeVisible();
                } catch (err) {
                        throw new Error(`Failed to open News & Top stories: ${err}`);
                }
        }

        async validateFirstNewsArticle() {
                try {
                        const first = this.page.locator('.newsHeight .title a').first();
                        const o1 = await first.textContent();
                        await first.click();

                        const o2 = this.page.locator('h1').first();
                        const o3 = await o2.textContent();

                        expect(o1).toBe(o3); // validating news article title
                } catch (err) {
                        throw new Error(`News article validation failed: ${err}`);
                }
        }

        async openExpertReviews() {
                try {
                        await this.mainMenu.hover();
                        const expertReviews = this.page.locator('li').getByText('Car Expert Reviews');
                        await expertReviews.click();
                        await this.page.waitForTimeout(2000);
                        const heading = this.page.locator('h1').getByText('Expert car reviews');
                        await this.page.waitForTimeout(2000);
                        await expect(heading).toBeVisible();
                } catch (err) {
                        throw new Error(`Failed to open Expert Reviews: ${err}`);
                }
        }

        async validateFirstExpertReview() {
                try {
                        await this.page.waitForSelector('.title a');
                        const title = this.page.locator('.title a').first();
                        const h1 = await title.textContent();
                        await title.click();

                        await this.page.waitForSelector('h1');
                        const head = this.page.locator('h1').first();
                        const h2 = await head.textContent();

                        expect(h1).toBe(h2); // validating expert review title
                        await expect(head).toBeVisible();
                } catch (err) {
                        throw new Error(`Expert review validation failed: ${err}`);
                }
        }
}
