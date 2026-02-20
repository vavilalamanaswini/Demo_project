import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { cities, login, language, search } from "../test_data/data.json";

test.describe("LogIn", () => {

        test("Invalid phone number @17", async ({ page }) => {
                const homePage = new HomePage(page);
                await page.goto('/');
                await homePage.openLogin();
                await homePage.enterPhone(login.invalidPhone);
                await homePage.assertErrorContains("Please enter valid mobile number");
        });

        test("Wrong OTP @18", async ({ page }) => {
                const homePage = new HomePage(page);
                await page.goto('/');
                await homePage.openLogin();
                await homePage.enterPhone(login.validPhone);
                await homePage.enterOtp(login.wrongOtp);
                await homePage.assertErrorContains("Invalid OTP");
        });

        test("Change Language and verify @19", async ({ page }) => {
                const homePage = new HomePage(page);
                await page.goto('/');
                await homePage.changeLanguage(language.name, language.displayText);
        });

        test("Change Location and verify @20", async ({ page }) => {
                const homePage = new HomePage(page);
                await page.goto('/');
                await page.getByText("Select City").click();
                await homePage.changeLocation(cities.alternate);
        });

});
