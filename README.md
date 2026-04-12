# setup-go-c8y-cli

[![Actions Status](https://github.com/reubenmiller/setup-go-c8y-cli/workflows/test/badge.svg)](https://github.com/reubenmiller/setup-go-c8y-cli/actions)

This action sets up the [go-c8y-cli](https://goc8ycli.netlify.app/) binary (`c8y`) in `$PATH` for use in GitHub Actions workflows.

## Usage

```yaml
env:
  C8Y_HOST: '${{ secrets.C8Y_HOST }}'
  C8Y_USER: '${{ secrets.C8Y_USER }}'
  C8Y_PASSWORD: '${{ secrets.C8Y_PASSWORD }}'
steps:
  - uses: actions/checkout@v6
  - uses: reubenmiller/setup-go-c8y-cli@main
  - run: |
      exec 0</dev/null  # Redirect stdin globally to avoid stdin detection issues in go-c8y-cli

      c8y microservices create --file myfile.zip
```

## Inputs

| Input | Default | Description |
|---|---|---|
| `version` | `latest` | go-c8y-cli version to install (e.g. `v2.52.1`) |
| `showVersion` | `true` | Print the installed version after setup |
| `showTenant` | `true` | Print tenant info after setup |

## Outputs

| Output | Description |
|---|---|
| `c8y` | Full path to the `c8y` binary |

## Examples

### Pin a specific version

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: reubenmiller/setup-go-c8y-cli@main
    with:
      version: 'v2.52.1'
      showVersion: false
      showTenant: false
  - run: |
      exec 0</dev/null  # Redirect stdin globally to avoid stdin detection issues in go-c8y-cli

      c8y microservices create --file myfile.zip
```
