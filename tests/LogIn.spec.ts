import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { cities, login, language } from "../test_data/data.json";

test.describe("LogIn", () => {

  test.skip("Invalid phone number @17 @sanity", async ({ page }) => {
    const homePage = new HomePage(page);
    await page.goto('/');
    await homePage.openLogin();
    await homePage.enterPhone(login.invalidPhone);
    await homePage.assertErrorContains("Please enter valid mobile number");
  });

  test.skip("Wrong OTP @18 @sanity", async ({ page }) => {
    const homePage = new HomePage(page);
    await page.goto('/');
    await homePage.openLogin();
    await homePage.enterPhone(login.validPhone);
    await homePage.enterOtp(login.wrongOtp);
    await homePage.assertErrorContains("Invalid OTP");
  });

  test.skip("Change Language and verify @19 @sanity", async ({ page }) => {
    const homePage = new HomePage(page);
    await page.goto('/');
    await homePage.changeLanguage(language.name, language.displayText);
  });

  test.skip("Change Location and verify @20 @sanity", async ({ page }) => {
    const homePage = new HomePage(page);
    await page.goto('/');
    await page.getByText("Select City").click();
    await homePage.changeLocation(cities.alternate);
  });

});
``