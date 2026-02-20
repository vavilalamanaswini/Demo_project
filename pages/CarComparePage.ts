import { Page, expect } from "@playwright/test";
import { EmiCalculatorUtils } from "../utils/EmiCalculatorUtils";
export class CarPage {
        readonly page: Page;

        constructor(page: Page) {
                this.page = page;
        }

        async navigateHome() {
                try {
                        await this.page.goto("/");
                } catch (error) {
                        console.error("Error navigating to home:", error);
                        throw error;
                }
        }

        async openNewCarsMenu() {
                try {
                        const latestCars = this.page.locator('.mainMenu', { hasText: 'NEW CARS' });
                        await latestCars.hover();
                } catch (error) {
                        console.error("Error opening NEW CARS menu:", error);
                        throw error;
                }
        }

        async exploreNewCars() {
                try {
                        await this.page.locator('li').getByText('Explore New Cars').click();
                } catch (error) {
                        console.error("Error exploring new cars:", error);
                        throw error;
                }
        }

        async openOnRoadPriceCalculator() {
                try {
                        await this.page.locator('.BtnFull a').first().click();
                } catch (error) {
                        console.error("Error opening on-road price calculator:", error);
                        throw error;
                }
        }

        async changeCity(city: string) {
                try {
                        await this.page.locator('.change i').click();
                        const change = this.page.locator('#cityName');
                        await change.fill(city);
                        await change.press('Enter');
                        await this.page.waitForTimeout(2000);
                        const cityText = await this.page.locator('h2').first().textContent();
                        expect(cityText).toContain(city);
                } catch (error) {
                        console.error(`Error changing city to ${city}:`, error);
                        throw error;
                }
        }

        async openCarDetails() {
                try {
                        await this.page.locator(".slink").first().click();
                        await this.page.waitForSelector(".modelNavInner .modelNavUl li");
                } catch (error) {
                        console.error("Error opening car details:", error);
                        throw error;
                }
        }

        async verifyCarDetailTabs() {
                try {

                        await this.page.locator('.modelNavUl [data-title$="Price"]').click();
                        await this.page.locator('span.gsc_closeBtn').click();
                        await expect(this.page.locator('h1')).toContainText('price');

                        await this.page.getByRole('link', { name: 'Images' }).click();
                        await expect(this.page.locator('h1')).toContainText('images');

                        await this.page.getByRole('link', { name: 'Specs' }).click();
                        await expect(this.page.locator('h1')).toContainText('Specifications');

                        await this.page.getByRole('link', { name: 'User Reviews' }).click();
                        await expect(this.page.locator('h1')).toContainText('reviews');
                } catch (error) {
                        console.error("Error verifying car detail tabs:", error);
                        throw error;
                }
        }

        async check360ViewAndGallery() {
                try {
                        await this.page.getByRole('link', { name: '360 View' }).click();
                        await expect(this.page.locator('h1')).toContainText('360 view');

                        await this.page.getByRole('link', { name: 'Images' }).click();
                        await expect(this.page.locator('h1')).toContainText('images');
                } catch (error) {
                        console.error("Error checking 360 view and gallery:", error);
                        throw error;
                }
        }

        async compareCars() {
                try {
                        await this.page.getByText('NEW CARS', { exact: true }).hover();
                        await this.page.getByText('Compare Cars').click();

                        // First car selection
                        await this.page.locator('.addCricle').first().click();
                        await this.page.locator('#brand1').click();
                        await this.page.locator("div[data-track-section='Brand / Model'] .gs_ta_results ul li.gs_ta_choice").first().click();

                        await this.page.locator("[title='Variant']").first().waitFor({ state: "visible" });
                        await this.page.locator("[title='Variant']").first().isEnabled();
                        await this.page.locator('#variant1').click();
                        await this.page.locator("div[data-track-section='Variant'] .gs_ta_results ul li.gs_ta_choice").first().click();

                        // Second car selection
                        await this.page.locator('.addCricle').nth(1).click();
                        await this.page.locator('#brand2').click();

                        const brandSection2 = this.page.locator("div[data-track-section='Brand / Model']").nth(1);
                        await brandSection2.locator("ul li.gs_ta_choice").nth(2).click();

                        await this.page.locator("[title='Variant']").nth(1).waitFor({ state: "visible" });
                        await this.page.locator("[title='Variant']").nth(1).isEnabled();
                        await this.page.locator('#variant2').click();

                        const variantSection2 = this.page.locator("div[data-track-section='Variant']").nth(1);
                        await variantSection2.locator("ul li.gs_ta_choice").first().click();

                        // Compare action
                        await this.page.getByRole('button', { name: 'Compare Now' }).click();
                        const compareBlock = this.page.locator('.gsc_container.gsc_container_hold .gsc_row').first();
                        await this.page.waitForSelector('.gsc_container.gsc_container_hold .gsc_row');
                        //await compareBlock.screenshot({ path: 'Compare-Block.png'});
                        await this.page.screenshot({ path: 'Full_page_compare.png', fullPage: true });

                } catch (error) {
                        console.error("Error comparing cars:", error);
                        throw error;
                }
        }


        async checkEMICalculator() {
                try {
                        await this.page.getByText('Edit EMI').click();
                        await this.page.check('input[name="loadPeriod"][value="3"]');
                        await this.page.waitForTimeout(5000);

                        const emiDisplayedText = await this.page.textContent('#emiPerMonth');
                        const loanAmountText = await this.page.locator("span.price").nth(1).textContent();

                        const loanAmount = parseInt(loanAmountText!.replace(/[^0-9]/g, ''), 10);
                        const annualRate = 9.8;
                        const loanPeriodYears = 3;
                        const emiDisplayed = parseInt(emiDisplayedText!.replace(/[^0-9]/g, ''), 10);

                        const emiCalculated = EmiCalculatorUtils.calculateEMI(loanAmount, annualRate, loanPeriodYears);
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

