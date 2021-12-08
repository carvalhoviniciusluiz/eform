import { GetAllUsersQuery } from './get-all-users.query';

describe('GetAllUsersQuery', () => {
  it('should get a GetAllUsersQuery instance', () => {
    const page = 0;
    const pagesize = 10;
    const command = new GetAllUsersQuery(page, pagesize);
    expect(command.page).toBe(page);
    expect(command.pagesize).toBe(pagesize);
    expect(command instanceof GetAllUsersQuery).toBe(true);
  });
});