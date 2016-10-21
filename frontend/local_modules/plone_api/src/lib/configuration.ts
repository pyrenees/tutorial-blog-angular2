export class Configuration {

  constructor(
    public https: boolean,
    public ip: string,
    public zodb: string,
    public site: string,
    public port: string,
    public type: string
  ) {  }
}

export class Authentication {
  constructor(
    public token?: string,
    public type?: string,
    public jwt?: string,
    public oauth?: string,
    public username?: string,
    public client_id?: string,
    public scope?: string
  ) { }
}
