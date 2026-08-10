import assert from "node:assert";
import {
  INDIA_CITY_OPTIONS,
  INDIA_STATES,
  findIndiaCity,
  findIndiaCityByKey,
  getIndiaCityOptions,
  makeIndiaLocationKey,
} from "../src/lib/indiaLocations";

function runIndiaLocationTests() {
  assert.strictEqual(INDIA_STATES.length, 36);
  assert.ok(INDIA_CITY_OPTIONS.length >= 200);
  assert.ok(INDIA_STATES.includes("Maharashtra"));
  assert.ok(INDIA_STATES.includes("Andaman and Nicobar Islands"));
  assert.ok(INDIA_STATES.includes("Ladakh"));

  const pune = findIndiaCity("pune");
  assert.deepStrictEqual(pune && { city: pune.city, state: pune.state }, {
    city: "Pune",
    state: "Maharashtra",
  });

  const puneKey = makeIndiaLocationKey("Maharashtra", "Pune");
  assert.strictEqual(findIndiaCityByKey(puneKey)?.state, "Maharashtra");

  const maharashtraCities = getIndiaCityOptions("Maharashtra");
  assert.ok(maharashtraCities.some((option) => option.city === "Pune"));
  assert.ok(maharashtraCities.some((option) => option.city === "Mumbai"));
  assert.ok(maharashtraCities.every((option) => option.state === "Maharashtra"));

  assert.strictEqual(findIndiaCity("Udaipur", "Tripura")?.state, "Tripura");
  assert.strictEqual(findIndiaCity("Udaipur", "Rajasthan")?.state, "Rajasthan");

  console.log("India location dropdown tests passed.");
}

runIndiaLocationTests();
