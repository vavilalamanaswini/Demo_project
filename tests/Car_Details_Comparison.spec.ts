import { test } from "@playwright/test";
import { CarPage } from "../pages/CarComparePage";
import { cities, login, language, search } from "../test_data/data.json";


test.describe("Car Details & Comparison", () => {
        test("Verify on-road price calculator works for different cities @8", async ({ page }) => {
                const carPage = new CarPage(page);
                await carPage.navigateHome();
                await carPage.openNewCarsMenu();
                await carPage.exploreNewCars();
                await carPage.openOnRoadPriceCalculator();
                await carPage.changeCity(cities.primary);
        });

        test("Open car detail pages @9", async ({ page }) => {
                const carPage = new CarPage(page);
                await carPage.navigateHome();
                await carPage.openCarDetails();
                await carPage.verifyCarDetailTabs();
        });

        test("Check 360° view and image gallery functionality @10", async ({ page }) => {
                const carPage = new CarPage(page);
                await carPage.navigateHome();
                await carPage.openCarDetails();
                await carPage.check360ViewAndGallery();
        });

        test("Compare two or more cars side by side @11", async ({ page }) => {
                const carPage = new CarPage(page);
                await carPage.navigateHome();
                await carPage.compareCars();
        });

        test("Check EMI calculator @12", async ({ page }) => {
                const carPage = new CarPage(page);
                await carPage.navigateHome();
                await carPage.openCarDetails();
                await carPage.checkEMICalculator();
        });
});
