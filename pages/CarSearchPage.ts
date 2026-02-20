import { Page, expect } from "@playwright/test";

export class CarSearchPage {
        readonly page: Page;

        constructor(page: Page) {
                this.page = page;
        }

        async gotoHome() {
                await this.page.goto("/");
                await this.page.waitForTimeout(5000);
        }

        async search(query: string) {
                await this.page.getByPlaceholder("Search or Ask a Question").click();
                await this.page.getByPlaceholder("Search or Ask a Question").fill(query);
                await this.page.getByPlaceholder("Search or Ask a Question").press("Enter");
        }

        async getHeadingText(selector: string) {
                return await this.page.locator(selector).textContent();
        }

        async verifyPositiveSearch(expected: string) {
                const readMore = this.page.locator(".gsc_col-lg-12 h2");
                const text = await readMore.textContent();
                expect(text).toContain(expected);
                expect(await readMore.isVisible()).toBeTruthy();
        }

        async verifyNegativeSearch(unexpected: string) {
                const mainStr = await this.page.locator("h1").textContent();
                const bool = mainStr?.includes(unexpected);
                expect(bool).toBeTruthy();
        }

        async searchByBudgetAndBrand() {
                await this.page.locator("#budget").click();
                await this.page.locator(".gs_ta_choice").nth(2).click();
                await this.page.getByRole("button", { name: "Search" }).click();
                await expect(this.page.locator("h2").nth(1)).toBeVisible();

                await this.page.goBack();
                await this.page.getByText("By Brand").click();
                await this.page.locator("#bmvBrand").click();
                const brandName = await this.page.locator(".gs_ta_choice").nth(1).innerText();
                await this.page.locator(".gs_ta_choice").nth(1).click();
                await this.page.getByRole("button", { name: "Search" }).click();

                await expect(this.page.locator("h1").first()).toContainText(brandName);

        }

        async applyFilters() {
                const ele = this.page.locator("#vehicleTypeName");
                await ele.click();
                await this.page.waitForTimeout(5000);
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


                await this.page.locator("input[title='Electric']").click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Electric");
                await this.page.locator("input[title='Electric']").click();


                await this.page.locator("input[title='Petrol']").click();
                expect(await this.getHeadingText(".NewCarFilterSearch h2")).toContain("Petrol");
                await this.page.locator("input[title='Petrol']").click();

        }

        async advancedSearch() {

                await this.page.locator(".nextgen.hover").click();
                await this.page.locator('input[title="Maruti"]').click();
                const Brand = (await this.page.locator('input[title="Maruti"]').inputValue()).toLocaleLowerCase();


                await this.page.waitForSelector('input[title="Hatchback"]');
                await this.page.locator('input[title="Hatchback"]').click();
                const vehicleType = (await this.page.locator('input[title="Hatchback"]').inputValue()).toLocaleLowerCase();

                await this.page.waitForSelector('input[title="Petrol"]');
                await this.page.locator('input[title="Petrol"]').click();
                const fuelType = (await this.page.locator('input[title="Petrol"]').inputValue()).toLocaleLowerCase();

                await this.page.waitForSelector(".crosschips");
                const count = await this.page.locator(".crosschips").count();
                let arr: string[] = [];
                for (let i = 0; i < count; i++) {
                        let text = await this.page.locator(".crosschips").nth(i).textContent();
                        if (text) arr.push(text.replace("×", "").toLocaleLowerCase());
                }

                const selections = [Brand, vehicleType, fuelType];
                for (let i of selections) {
                        const found = arr.includes(i);
                        expect(found).toBeTruthy();
                }
        }

        async validateUpcomingAndNewCars() {
                const newCars = this.page.locator(".mainMenu", { hasText: "NEW CARS " });
                await newCars.hover();
                await this.page.getByRole("link", { name: "Upcoming Cars", exact: true }).click();
                await this.page.getByText("Read More", { exact: true }).click();
                await expect(this.page.getByText("Upcoming Cars Price List in India 2026", { exact: true })).toBeVisible();

                await newCars.hover();
                await this.page.getByRole("link", { name: "New Launches", exact: true }).click();
                await this.page.getByText("Read More", { exact: true }).click();
                await expect(this.page.getByText("Newly Launched cars in 2026", { exact: true })).toBeVisible();
        }

        async validatePopularBrands() {
                const newCars = this.page.locator(".mainMenu", { hasText: "NEW CARS " });
                await newCars.hover();
                await this.page.getByText("Popular Brands", { exact: true }).hover();
                await this.page.locator("span").filter({ hasText: "Tata Cars" }).first().click();
                await expect(this.page.getByRole("heading", { name: "Tata car models" })).toBeVisible();

                await this.page.locator("span.changeBrand").click();
                await this.page.getByPlaceholder("Change Brand", { exact: true }).click();
                await this.page.locator("li").filter({ hasText: "Rolls-Royce" }).first().click();
                await expect(this.page.getByRole("heading", { name: "Rolls-Royce car models" })).toBeVisible();
        }
}
