
import { Page, expect } from "@playwright/test";

export class CarPage {
        readonly page: Page;

        constructor(page: Page) {
                this.page = page;
        }

        async navigateToHome() {
                try {
                        await this.page.goto("/");
                        await this.page.waitForSelector("li.mainMenu");
                } catch (error) {
                        console.error("Error navigating to home:", error);
                        throw error;
                }
        }

        async searchUsedCarsByCity(city: string) {
                try {
                        await this.page.getByText("Used cars", { exact: true }).hover();
                        await this.page.getByText("Used Cars In Your City", { exact: true }).hover();
                        await this.page.locator('a[title="Used Cars In Chennai"]').click();
                        //await this.page.getByText(`Continue with ${city}`).click();
                        await expect(this.page.locator("h1")).toContainText(`Used Cars in ${city}`);
                } catch (error) {
                        console.error(`Error searching used cars in ${city}:`, error);
                        throw error;
                }
        }

        async checkDealerContactDetails(city: string) {
                try {
                        await this.page.getByText("Used cars", { exact: true }).hover();
                        await this.page.locator("li").getByText("Dealership Near Me").click();

                        await this.page.getByAltText(city).first().click();

                        const dealHead = this.page.locator("h1").first();
                        await expect(dealHead).toBeVisible();

                        const example = this.page.locator("//section//a").first();
                        await example.click();

                        await this.page.waitForLoadState("domcontentloaded");
                        const ex = this.page.locator("h1").first();
                        await expect(ex).toBeVisible(); // validating dealer details
                } catch (error) {
                        console.error(`Error checking dealer contact details in ${city}:`, error);
                        throw error;
                }
        }
}
