# setup-go-c8y-cli

[![Actions Status](https://github.com/reubenmiller/setup-go-c8y-cli/workflows/build-test/badge.svg)](https://github.com/reubenmiller/setup-go-c8y-cli/actions)

This action sets up a binary in \$PATH for use in actions

```yaml
env:
  C8Y_HOST: ${{ secrets.C8Y_HOST }}
  C8Y_USER: ${{ secrets.C8Y_USER }}
  C8Y_PASSWORD: ${{ secrets.C8Y_PASSWORD }}
steps:
  - uses: actions/checkout@v3
  - uses: reubenmiller/setup-go-c8y-cli@main
  - run: |
      c8y microservice create --file myfile.zip
```

You can customize some of the go-c8y-cli setup options:

```yaml
env:
  C8Y_HOST: ${{ secrets.C8Y_HOST }}
  C8Y_USER: ${{ secrets.C8Y_USER }}
  C8Y_PASSWORD: ${{ secrets.C8Y_PASSWORD }}
steps:
  - uses: actions/checkout@v3
  - uses: reubenmiller/setup-go-c8y-cli@main
    with:
      version: '2.36.0'
      showVersion: false
      showTenant: false
  - run: |
      c8y microservice create --file myfile.zip
```
