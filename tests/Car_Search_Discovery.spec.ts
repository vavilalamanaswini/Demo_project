import { test } from "@playwright/test";
import { CarSearchPage } from "../pages/CarSearchPage";
import { search } from "../test_data/data.json";

test.describe("Car Search Discovery", () => {
  test("Positive Search @1 @smoke", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.search(search.positiveQuery);
    await carPage.verifyPositiveSearch(search.positiveExpected);
  });

  test.fail("Negative Search @2 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.search(search.negativeQuery);
    await carPage.verifyNegativeSearch(search.negativeQuery);
  });

  test("Search by brand/budget @3 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.searchByBudgetAndBrand();
  });

  test("Apply filters @4 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.applyFilters();
  });

  test("Advanced search @5 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.advancedSearch();
  });

  test("Upcoming/New cars @6 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.validateUpcomingAndNewCars();
  });

  test("Popular brands @7 @sanity", async ({ page }) => {
    const carPage = new CarSearchPage(page);
    await carPage.gotoHome();
    await carPage.validatePopularBrands();
  });
});