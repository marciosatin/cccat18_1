import axios from "axios";

axios.defaults.validateStatus = function () {
    return true; // To return true to allow all status codes
}

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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.car_plate).toBe(input.carPlate);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid name");
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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid email");
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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid cpf");
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
    await axios.post("http://localhost:3000/signup", input);
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Duplicated account");
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
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid car plate");
});