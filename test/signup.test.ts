import { AccountDAODatabase, AccountDAOMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    // const accountDAO = new AccountDAODatabase();
    const accountDAO = new AccountDAOMemory();
    signup = new Signup(accountDAO);
    getAccount = new GetAccount(accountDAO);
});

test("Deve criar a conta de um passageiro", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "password123"
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.carPlate).toBe(input.carPlate);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
    expect(outputGetAccount.password).toBe(input.password);
});
test("Não deve criar a conta de um passageiro com nome inválido", async function () {
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "password123"
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar a conta de um passageiro com email inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "password123"
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar a conta de um passageiro com cpf inválido", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "9745632155",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "password123"
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar a conta de um passageiro duplicado", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "ABC1234",
        isPassenger: true,
        isDriver: false,
        password: "password123"
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Duplicated account"));
});

test("Não deve criar a conta de um motorista com placa inválida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "ABC123",
        isPassenger: false,
        isDriver: true,
        password: "password123"
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
});