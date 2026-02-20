import { test } from "@playwright/test";
import { NewsPage } from "../pages/NewsPage";

test.describe("News, Reviews & Media", () => {

        test("Access latest car news articles @15", async ({ page }) => {
                test.slow();
                const newsPage = new NewsPage(page);
                await page.goto("/");
                await newsPage.openNewsAndTopStories();
                await newsPage.validateFirstNewsArticle();
        });

        test("Validate expert reviews and long-term reports @16", async ({ page }) => {
                const newsPage = new NewsPage(page);
                await page.goto("/");
                await newsPage.openExpertReviews();
                await newsPage.validateFirstExpertReview();
        });

});
