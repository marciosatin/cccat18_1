import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO, { AccountDAODatabase } from "./AccountDAO";

export default class Signup {

	constructor (readonly accountDAO: AccountDAO) {
    }
	async execute (input: any) {
		const id = crypto.randomUUID();
		const accountData = await this.accountDAO.getAccountByEmail(input.email);
		if (accountData) throw new Error("Duplicated account");
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate");
		input.id = id;
		await this.accountDAO.saveAccount(input);
		return { accountId: id };
	}
	
	async getAccount (accountId: string) {
		const accountData = await this.accountDAO.getAccountById(accountId);
		return accountData;
	};
}
