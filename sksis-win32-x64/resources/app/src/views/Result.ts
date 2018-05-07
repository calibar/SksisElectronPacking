export class Result {
  constructor(
    public session_token: string,
    public session_id: string,
    public id: string,
    public name: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public is_sys_admin: string,
    public last_login_date: string,
    public host: string,
    public role: string,
    public role_id: string
    ) { }
}
