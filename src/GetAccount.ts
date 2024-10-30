import AccountDAO from "./AccountDAO";

export default class GetAccount {

    constructor (readonly accountDAO: AccountDAO) {
    }


    async execute (accountId: string): Promise<any> {
        const accountData = await this.accountDAO.getAccountById(accountId);
        if (!accountData) throw new Error("Account not found");
        return accountData;
    }
}