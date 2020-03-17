import app from "../utils/testApp";
import { agent, Response } from "supertest";
import { Connection } from "typeorm";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";

let db: Connection;
let userRepository: UserRepository;

beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
});

afterAll(async done => {
    await db.close();
    done();
});

describe("GET /api/users", () => {
    it("200: 유저 정보 반환에 성공한다", done => {
        agent(app)
            .get("/api/users/6d2deecf-a0f7-470f-b31f-ede0024efece")
            .expect(200)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                const { body } = res;
                expect(body.email).toEqual("hellojest@gmail.com");
                expect(body.realName).toEqual("홍길동");
                done();
            });
    });

    it("400: 잘못된 유저ID 파라미터로 반환에 실패한다", done => {
        agent(app)
            .get("/api/users/not-user")
            .expect(400)
            .end((err: any, res: Response) => {
                if (err) return done(err);
                const { body } = res;
                expect(body.message).toBe("일치하는 사용자가 없습니다.");
                done();
            });
    });
});
