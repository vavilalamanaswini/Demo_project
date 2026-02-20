import { Page, expect, Locator } from '@playwright/test';

/**
 * Page Object for Home/Login, language & location changes.
 * NOTE: Functional behavior preserved.
 */
export class HomePage {
        public readonly page: Page;

        // Stable locators
        private readonly loginIcon: Locator;
        private readonly banner: Locator;

        constructor(page: Page) {
                this.page = page;

                this.loginIcon = this.page.locator('.userIcon+span');
                this.banner = this.page.getByRole('banner');
        }

        async openLogin(): Promise<void> {
                try {
                        await this.loginIcon.waitFor({ state: 'visible', timeout: 10000 });
                        await this.loginIcon.click();
                } catch (err) {
                        throw new Error(`Login icon not found or not clickable: ${err}`);
                }
        }

        async enterPhone(phone: string): Promise<void> {
                await this.page.locator('input[type="tel"]').pressSequentially(phone, { delay: 200 });
        }

        async enterOtp(otp: string): Promise<void> {
                await this.page.locator('.otpboxholder input[type="text"]').pressSequentially(otp, { delay: 200 });
        }

        async assertErrorContains(text: string): Promise<void> {
                await expect(this.page.locator('span.error, .otpboxholder .error')).toContainText(text);
        }

        async changeLanguage(language: string, expectedText: string): Promise<void> {
                try {
                        await this.page.locator('.LangProfile').click();
                        await this.page.locator(`a[title="${language}"]`).click();
                        await expect(this.banner).toContainText(expectedText);
                } catch (err) {
                        throw new Error(`Language change failed: ${err}`);
                }
        }

        async changeLocation(city: string): Promise<void> {
                try {
                        await this.page.locator('#cityName').pressSequentially(city, { delay: 200 });
                        await this.page.locator(`li[data-value="${city}"]`).click();
                        await expect(this.banner).toContainText(city);
                } catch (err) {
                        throw new Error(`Location change failed: ${err}`);
                }
        }
}