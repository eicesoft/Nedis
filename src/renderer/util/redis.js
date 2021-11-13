import redis from "redis";

class Redis {
  constructor(host, port, username = "", pass = "", load_fn = null) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.pass = pass;
    this.client = null;
    this.load_fn = load_fn;
    this.connect();
  }

  connect() {
    this.client = redis.createClient({
      connect_timeout: 1000,
      retry_max_delay: 2,
      host: this.host,
      port: this.port
    });

    this.client.on("connect", this.load_fn);
  }

  /**
   *
   * @returns boolean
   */
  async ping() {
    let resp = await new Promise(resolve => {
      this.client.ping(function (err, data) {
        resolve(data);
      });
    });

    if (resp == "PONG") {
      return true;
    } else {
      return false;
    }
  }
  async getKeyInfo(key) {
    let key_info = {
      title: key,
      name: key,
      type: "",
      ttl: -1,
      size: 0,
      json: null,
      isJson: false,
      value: null
    };

    let type_resp = await this.type(key);
    key_info.type = type_resp;

    let ttl_resp = await this.ttl(key);
    key_info.ttl = ttl_resp;

    let val_resp;
    switch (type_resp) {
      case "string":
        val_resp = await this.get(key);
        try {
          key_info.json = JSON.parse(val_resp);

          if (typeof key_info.json == "object" && key_info.json) {
            key_info.isJson = true;
          } else {
            key_info.isJson = false;
          }
        } catch (e) {
          key_info.isJson = false;
        }
        key_info.size = val_resp.length;
        break;
      case "hash":
        val_resp = await this.hgetall(key);
        key_info.size = Object.keys(val_resp).length;
        break;
      case "list":
        val_resp = await this.lrange(key);
        key_info.size = val_resp.length;
        break;
      case "set":
        val_resp = await this.smembers(key);
        key_info.size = val_resp.length;
        break;
    }
    key_info.value = val_resp;

    return key_info;
  }

  async info() {
    let resp = await new Promise(resolve => {
      this.client.info(function (err, data) {
        resolve(data);
      });
    });

    let infos = resp.split("\n");
    let group = "";

    let server_infos = {};
    for (let info of infos) {
      if (info.substring(0, 1) == "#") {
        group = info.substring(1).trim();
        server_infos[group] = {};
      } else {
        if (info.indexOf(":") !== -1) {
          let infos = info.split(":");
          server_infos[group][infos[0]] = infos[1];
        }
      }
    }

    return server_infos;
  }

  async keys(filter = "*") {
    let resp = await new Promise(resolve => {
      this.client.keys(filter, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async select(db) {
    let resp = await new Promise(resolve => {
      this.client.select(db, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async type(key) {
    let resp = await new Promise(resolve => {
      this.client.type(key, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async ttl(key) {
    let resp = await new Promise(resolve => {
      this.client.ttl(key, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async get(key) {
    let resp = await new Promise(resolve => {
      this.client.get(key, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async hgetall(key) {
    let resp = await new Promise(resolve => {
      this.client.hgetall(key, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async lrange(key, start = 0, end = -1) {
    let resp = await new Promise(resolve => {
      this.client.lrange(key, start, end, function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }

  async smembers(key) {
    let resp = await new Promise(resolve => {
      this.client.smembers(key, function (err, data) {
        resolve(data);
      });
    });
    console.log(resp);
    return resp;
  }

  async close() {
    let resp = await new Promise(resolve => {
      this.client.quit(function (err, data) {
        resolve(data);
      });
    });

    return resp;
  }
}

export default Redis;
