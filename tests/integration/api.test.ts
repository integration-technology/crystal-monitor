import { api } from "@serverless/cloud"

test("should return months 7", async () => {
  const { body } = await api.get("/months").invoke()
  expect(body).toHaveProperty("monthsToDeparture")
  expect(body.monthsToDeparture).toEqual(7)
})
