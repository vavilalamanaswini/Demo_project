import { Page, expect } from '@playwright/test';

export class HomePage {
        readonly page: Page;

        constructor(page: Page) {
                this.page = page;
        }

        async openLogin() {
                try {
                        await this.page.locator('.userIcon+span').waitFor({ state: 'visible', timeout: 10000 });
                        await this.page.locator('.userIcon+span').click();
                } catch (err) {
                        throw new Error(`Login icon not found or not clickable: ${err}`);
                }
        }

        async enterPhone(phone: string) {
                await this.page.locator('input[type="tel"]').pressSequentially(phone, { delay: 200 });
        }

        async enterOtp(otp: string) {
                await this.page.locator('.otpboxholder input[type="text"]').pressSequentially(otp, { delay: 200 });
        }

        async assertErrorContains(text: string) {
                await expect(this.page.locator('span.error, .otpboxholder .error')).toContainText(text);
        }

        async changeLanguage(language: string, expectedText: string) {
                try {
                        await this.page.locator('.LangProfile').click();
                        await this.page.locator(`a[title="${language}"]`).click();
                        await expect(this.page.getByRole('banner')).toContainText(expectedText);
                } catch (err) {
                        throw new Error(`Language change failed: ${err}`);
                }
        }

        async changeLocation(city: string) {
                try {
                        await this.page.locator('#cityName').pressSequentially(city, { delay: 200 });
                        await this.page.locator(`li[data-value="${city}"]`).click();
                        await expect(this.page.getByRole('banner')).toContainText(city);
                } catch (err) {
                        throw new Error(`Location change failed: ${err}`);
                }
        }
}
