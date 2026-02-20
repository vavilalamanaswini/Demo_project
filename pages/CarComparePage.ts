import { Page, expect, Locator } from "@playwright/test";
import { EmiCalculatorUtils } from "../utils/EmiCalculatorUtils";

export class CarPage {
        /** Playwright Page */
        public readonly page: Page;

        // ====== Stable, private locators ======
        private readonly newCarsMenu: Locator;
        private readonly exploreNewCarsItem: Locator;
        private readonly onRoadPriceFirstCta: Locator;
        private readonly h1Heading: Locator;
        private readonly closeModalBtn: Locator;
        private readonly compareNowBtn: Locator;
        private readonly compareContainerRow: Locator;

        constructor(page: Page) {
                this.page = page;

                this.newCarsMenu = this.page.locator(".mainMenu", { hasText: "NEW CARS" });
                this.exploreNewCarsItem = this.page.locator("li").getByText("Explore New Cars");
                this.onRoadPriceFirstCta = this.page.locator(".BtnFull a").first();

                this.h1Heading = this.page.locator("h1");
                this.closeModalBtn = this.page.locator("span.gsc_closeBtn");

                this.compareNowBtn = this.page.getByRole("button", { name: "Compare Now" });
                this.compareContainerRow = this.page
                        .locator(".gsc_container.gsc_container_hold .gsc_row")
                        .first();
        }

        /** Navigate to site root. */
        async navigateHome(): Promise<void> {
                try {
                        await this.page.goto("/");
                } catch (error) {
                        console.error("Error navigating to home:", error);
                        throw error;
                }
        }

        /** Hover NEW CARS menu. */
        async openNewCarsMenu(): Promise<void> {
                try {
                        await this.newCarsMenu.hover();
                } catch (error) {
                        console.error("Error opening NEW CARS menu:", error);
                        throw error;
                }
        }

        /** Click Explore New Cars. */
        async exploreNewCars(): Promise<void> {
                try {
                        await this.exploreNewCarsItem.click();
                } catch (error) {
                        console.error("Error exploring new cars:", error);
                        throw error;
                }
        }

        /** Open On-road price calculator (first CTA). */
        async openOnRoadPriceCalculator(): Promise<void> {
                try {
                        await this.onRoadPriceFirstCta.click();
                } catch (error) {
                        console.error("Error opening on-road price calculator:", error);
                        throw error;
                }
        }

        /** Change current city in calculator and verify heading reflects it. */
        async changeCity(city: string): Promise<void> {
                try {
                        await this.page.locator(".change i").click();
                        const change = this.page.locator("#cityName");
                        await change.fill(city);
                        await change.press("Enter");
                        await this.page.waitForTimeout(2000); // original wait preserved
                        const cityText = await this.page.locator("h2").first().textContent();
                        expect(cityText).toContain(city);
                } catch (error) {
                        console.error(`Error changing city to ${city}:`, error);
                        throw error;
                }
        }

        /** Open first car details and wait for tabs list. */
        async openCarDetails(): Promise<void> {
                try {
                        await this.page.locator(".slink").first().click();
                        await this.page.waitForSelector(".modelNavInner .modelNavUl li");
                } catch (error) {
                        console.error("Error opening car details:", error);
                        throw error;
                }
        }

        /** Verify tabs: Price, Images, Specs, Reviews. */
        async verifyCarDetailTabs(): Promise<void> {
                try {
                        await this.page.locator('.modelNavUl [data-title$="Price"]').click();
                        await this.closeModalBtn.click();
                        await expect(this.h1Heading).toContainText("price");

                        await this.page.getByRole("link", { name: "Images" }).click();
                        await expect(this.h1Heading).toContainText("images");

                        await this.page.getByRole("link", { name: "Specs" }).click();
                        await expect(this.h1Heading).toContainText("Specifications");

                        await this.page.getByRole("link", { name: "User Reviews" }).click();
                        await expect(this.h1Heading).toContainText("reviews");
                } catch (error) {
                        console.error("Error verifying car detail tabs:", error);
                        throw error;
                }
        }

        /** Verify 360 View & Images tabs. */
        async check360ViewAndGallery(): Promise<void> {
                try {
                        await this.page.getByRole("link", { name: "360 View" }).click();
                        await expect(this.h1Heading).toContainText("360 view");

                        await this.page.getByRole("link", { name: "Images" }).click();
                        await expect(this.h1Heading).toContainText("images");
                } catch (error) {
                        console.error("Error checking 360 view and gallery:", error);
                        throw error;
                }
        }

        /** Compare two cars end-to-end and capture a full page screenshot. */
        async compareCars(): Promise<void> {
                try {
                        await this.page.getByText("NEW CARS", { exact: true }).hover();
                        await this.page.getByText("Compare Cars").click();

                        // First car selection
                        await this.page.locator(".addCricle").first().click();
                        await this.page.locator("#brand1").click();
                        await this.page
                                .locator("div[data-track-section='Brand / Model'] .gs_ta_results ul li.gs_ta_choice")
                                .first()
                                .click();

                        await this.page.locator("[title='Variant']").first().waitFor({ state: "visible" });
                        await this.page.locator("[title='Variant']").first().isEnabled();
                        await this.page.locator("#variant1").click();
                        await this.page
                                .locator("div[data-track-section='Variant'] .gs_ta_results ul li.gs_ta_choice")
                                .first()
                                .click();

                        // Second car selection
                        await this.page.locator(".addCricle").nth(1).click();
                        await this.page.locator("#brand2").click();

                        const brandSection2 = this.page.locator("div[data-track-section='Brand / Model']").nth(1);
                        await brandSection2.locator("ul li.gs_ta_choice").nth(2).click();

                        await this.page.locator("[title='Variant']").nth(1).waitFor({ state: "visible" });
                        await this.page.locator("[title='Variant']").nth(1).isEnabled();
                        await this.page.locator("#variant2").click();

                        const variantSection2 = this.page.locator("div[data-track-section='Variant']").nth(1);
                        await variantSection2.locator("ul li.gs_ta_choice").first().click();

                        // Compare action
                        await this.compareNowBtn.click();
                        await this.page.waitForSelector(".gsc_container.gsc_container_hold .gsc_row");

                        // Screenshot (original behavior preserved)
                        // await this.compareContainerRow.screenshot({ path: 'Compare-Block.png' });
                        await this.page.screenshot({ path: "Full_page_compare.png", fullPage: true });
                } catch (error) {
                        console.error("Error comparing cars:", error);
                        throw error;
                }
        }

        /** Validate EMI calculator math with tolerance. */
        async checkEMICalculator(): Promise<void> {
                try {
                        await this.page.getByText("Edit EMI").click();
                        await this.page.check('input[name="loadPeriod"][value="3"]');
                        await this.page.waitForTimeout(5000); // original wait preserved

                        const emiDisplayedText = await this.page.textContent("#emiPerMonth");
                        const loanAmountText = await this.page.locator("span.price").nth(1).textContent();

                        const loanAmount = parseInt(loanAmountText!.replace(/[^0-9]/g, ""), 10);
                        const annualRate = 9.8;
                        const loanPeriodYears = 3;
                        const emiDisplayed = parseInt(emiDisplayedText!.replace(/[^0-9]/g, ""), 10);

                        const emiCalculated = EmiCalculatorUtils.calculateEMI(
                                loanAmount,
                                annualRate,
                                loanPeriodYears
                        );
                        console.log("Displayed --> " + emiDisplayed);
                        console.log("Calculated --> " + emiCalculated);

                        const tolerance = 50;
                        expect(Math.abs(emiCalculated - emiDisplayed)).toBeLessThanOrEqual(tolerance);
                } catch (error) {
                        console.error("Error checking EMI calculator:", error);
                        throw error;
                }
        }
}