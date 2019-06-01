模板启动需要用到pm2，如果没有安装，请先安装。

```
npm i -g pm2    # 安装pm2
```

然后执行下列指令:
```
npm i                                                   # 安装需要的库
pm2 --update-env --uid username start parse-server.json # 启动pm2，其中 --update-env 用于更新用到的环境变量，
                                                        # --uid用于指定实际执行用户，否则会以root用户执行，
                                                        # 如果文件有上传并保存为文件功能，会变成root拥有，存在安全隐患。
pm2 save                                                # 保存配置，以便系统重启后可以自动运行。
```

pm2目前版本2.10.1存在更新环境变量问题，只能先删除配置，重新启动并保存。

parse-dashboard用户密码，应采用bcrypt加密，可以利用网站 https://www.bcrypt-generator.com 直接生成。