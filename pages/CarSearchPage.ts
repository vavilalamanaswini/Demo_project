import { Page, expect, Locator } from "@playwright/test";

export class CarSearchPage {
        public readonly page: Page;

        // ====== Stable, private locators ======
        private readonly searchBox: Locator;
        private readonly h1: Locator;
        private readonly h2: Locator;
        private readonly newCarsMenu: Locator;

        constructor(page: Page) {
                this.page = page;

                this.searchBox = this.page.getByPlaceholder("Search or Ask a Question");
                this.h1 = this.page.locator("h1");
                this.h2 = this.page.locator("h2");
                this.newCarsMenu = this.page.locator(".mainMenu", { hasText: "NEW CARS " });
        }

        async gotoHome(): Promise<void> {
                await this.page.goto("/");
                await this.page.waitForTimeout(5000); // original wait preserved
        }

        async search(query: string): Promise<void> {
                await this.searchBox.click();
                await this.searchBox.fill(query);
                await this.searchBox.press("Enter");
        }

        async getHeadingText(selector: string): Promise<string | null> {
                return await this.page.locator(selector).textContent();
        }

        async verifyPositiveSearch(expected: string): Promise<void> {
                const readMore = this.page.locator(".gsc_col-lg-12 h2");
                const text = await readMore.textContent();
                expect(text).toContain(expected);
                expect(await readMore.isVisible()).toBeTruthy();
        }

        async verifyNegativeSearch(unexpected: string): Promise<void> {
                const mainStr = await this.h1.textContent();
                const bool = mainStr?.includes(unexpected);
                expect(bool).toBeTruthy();
        }

        async searchByBudgetAndBrand(): Promise<void> {
                await this.page.locator("#budget").click();
                await this.page.locator(".gs_ta_choice").nth(2).click();
                await this.page.getByRole("button", { name: "Search" }).click();
                await expect(this.h2.nth(1)).toBeVisible();

                await this.page.goBack();
                await this.page.getByText("By Brand").click();
                await this.page.locator("#bmvBrand").click();
                const brandName = await this.page.locator(".gs_ta_choice").nth(1).innerText();
                await this.page.locator(".gs_ta_choice").nth(1).click();
                await this.page.getByRole("button", { name: "Search" }).click();

                await expect(this.h1.first()).toContainText(brandName);
        }

        async applyFilters(): Promise<void> {
                const ele = this.page.locator("#vehicleTypeName");
                await ele.click();
                await this.page.waitForTimeout(5000); // original wait preserved
                await ele.pressSequentially("Hatch", { delay: 1000 });
                await this.page.locator('li[data-value="Hatchback"]').click();
                await this.page.getByRole("button", { name: "Search" }).click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Hatchback");
                await this.page.locator(".icon-hatchbackIcon").click();

                await this.page.locator(".icon-sedanIcon").click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Sedan");
                await this.page.locator(".icon-sedanIcon").click();

                await this.page.locator(".icon-suvIcon").click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Suv");
                await this.page.locator(".icon-suvIcon").click();

                await this.page.locator('input[title="Electric"]').click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Electric");
                await this.page.locator('input[title="Electric"]').click();

                await this.page.locator('input[title="Petrol"]').click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Petrol");
                await this.page.locator('input[title="Petrol"]').click();
        }

        async advancedSearch(): Promise<void> {
                await this.page.locator(".nextgen.hover").click();

                const maruti = this.page.locator('input[title="Maruti"]');
                await maruti.click();
                const Brand = (await maruti.inputValue()).toLocaleLowerCase();

                await this.page.waitForSelector('input[title="Hatchback"]');
                const hatch = this.page.locator('input[title="Hatchback"]');
                await hatch.click();
                const vehicleType = (await hatch.inputValue()).toLocaleLowerCase();

                await this.page.waitForSelector('input[title="Petrol"]');
                const petrol = this.page.locator('input[title="Petrol"]');
                await petrol.click();
                const fuelType = (await petrol.inputValue()).toLocaleLowerCase();

                await this.page.waitForSelector(".crosschips");
                const count = await this.page.locator(".crosschips").count();

                const chips: string[] = [];
                for (let i = 0; i < count; i++) {
                        const text = await this.page.locator(".crosschips").nth(i).textContent();
                        if (text) chips.push(text.replace("×", "").toLocaleLowerCase());
                }

                const selections = [Brand, vehicleType, fuelType];
                for (const sel of selections) {
                        const found = chips.includes(sel);
                        expect(found).toBeTruthy();
                }
        }

        async validateUpcomingAndNewCars(): Promise<void> {
                await this.newCarsMenu.hover();
                await this.page.getByRole("link", { name: "Upcoming Cars", exact: true }).click();
                await this.page.getByText("Read More", { exact: true }).click();
                await expect(
                        this.page.getByText("Upcoming Cars Price List in India 2026", { exact: true })
                ).toBeVisible();

                await this.newCarsMenu.hover();
                await this.page.getByRole("link", { name: "New Launches", exact: true }).click();
                await this.page.getByText("Read More", { exact: true }).click();
                await expect(
                        this.page.getByText("Newly Launched cars in 2026", { exact: true })
                ).toBeVisible();
        }

        async validatePopularBrands(): Promise<void> {
                await this.newCarsMenu.hover();
                await this.page.getByText("Popular Brands", { exact: true }).hover();
                await this.page.locator("span").filter({ hasText: "Tata Cars" }).first().click();
                await expect(this.page.getByRole("heading", { name: "Tata car models" })).toBeVisible();

                await this.page.locator("span.changeBrand").click();
                await this.page.getByPlaceholder("Change Brand", { exact: true }).click();
                await this.page.locator("li").filter({ hasText: "Rolls-Royce" }).first().click();
                await expect(this.page.getByRole("heading", { name: "Rolls-Royce car models" })).toBeVisible();
        }
}