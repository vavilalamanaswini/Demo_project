import { test } from "@playwright/test";
import { CarSearchPage } from "../pages/CarSearchPage";
import { cities, login, language, search } from "../test_data/data.json";


test.describe("Car Search Discovery", () => {
        test("Positive Search @1", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.search(search.positiveQuery);
                await carPage.verifyPositiveSearch(search.positiveExpected);
        });

        test.fail("Negative Search @2", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.search(search.negativeQuery);
                await carPage.verifyNegativeSearch(search.negativeQuery);
        });

        test("Search by brand/budget @3", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.searchByBudgetAndBrand();
        });

        test("Apply filters @4", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.applyFilters();
        });

        test("Advanced search @5", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.advancedSearch();
        });

        test("Upcoming/New cars @6", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.validateUpcomingAndNewCars();
        });

        test("Popular brands @7", async ({ page }) => {
                const carPage = new CarSearchPage(page);
                await carPage.gotoHome();
                await carPage.validatePopularBrands();
        });
});


