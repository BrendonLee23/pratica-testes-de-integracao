import app from "../src/index";
import supertest from "supertest";

const api = supertest(app);

describe("Post/fruits", () =>{
    it("should return 201 when inserting a fruit", async ()=>{
        const result = await api.post("/fruits").send({
            name: "morango",
            price: 100
        })
        expect(result.status).toBe(201)
    }) 
    it("should return 409 when inserting a fruit that is already registered", async () => {
        await api.post("/fruits").send({
            name: "morango",
            price: 100
        })
        const result = await api.post("/fruits").send({
            name: "morango",
            price: 100
        })
        expect(result.status).toBe(409)
    })
    it("should return 201 when inserting a fruit", async ()=>{
        const result = await api.post("/fruits").send({
            name: "morango"
        })
        expect(result.status).toBe(422)

        const result2 = await api.post("/fruits").send({
            price: 100
        })
        expect(result2.status).toBe(422)

        const result3 = await api.post("/fruits").send({})
        expect(result3.status).toBe(422)
    })
    
})


describe("Get/fruits", () =>{
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async ()=>{
        const result = (await api.get("/fruits/3"))
        expect(result.status).toBe(404)
    }) 
    it("should return 400 when id param is present but not valid", async ()=>{
        const result = (await api.get("/fruits/-2"))
        expect(result.status).toBe(400)
    })
    it("should return one fruit when given a valid and existing id", async ()=>{
        await api.post("/fruits/").send({
            name: "morango",
            price: 100
        })
        const result = (await api.get("/fruits/1"))
        expect(result.status).toBe(200)
        expect(result.body).toEqual(
            expect.objectContaining({
                name: "morango",
                price: 100
            })
        )
    })
    it("should return all fruits if no id is present", async ()=>{
        await api.post("/fruits").send({
            name: "morango",
            price: 100
        })
        const result = (await api.get("/fruits"))
        expect(result.status).toBe(200)
        expect(result.body).toEqual([{
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number)
        }])
    })
})

