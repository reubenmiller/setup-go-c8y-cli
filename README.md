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
| `extensions` | | go-c8y-cli extensions to install, one per line (or separated by commas or spaces). Each entry is a repository (`owner/repo` or a URL), optionally followed by `@<release tag or commit ref>`. Without a ref, the latest release is installed |
| `token` | `${{ github.token }}` | GitHub token used when installing extensions, to avoid GitHub API rate limits |

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

### Install extensions

Extensions add commands to `c8y`, e.g. [c8y-tenant-sync](https://github.com/reubenmiller/c8y-tenant-sync) adds `c8y tenant-sync`. Pin each extension to a release tag so that workflow runs are repeatable:

```yaml
steps:
  - uses: actions/checkout@v6
  - uses: reubenmiller/setup-go-c8y-cli@main
    with:
      showTenant: false
      extensions: |
        reubenmiller/c8y-tenant-sync@v0.10.5
  - run: c8y tenant-sync validate -f tenant.yaml
```

Notes:

- Binary extensions (extensions which ship a compiled binary in their GitHub releases) need go-c8y-cli v2.57.0 or later.
- An extension which is already installed at the requested ref is kept. Otherwise it is replaced, so the action can be used more than once in a job and on self-hosted runners.
- Extensions are downloaded on every run (they are not cached). The `token` input is used for the GitHub API calls; set it to an empty string to install without a token, e.g. on GitHub Enterprise Server.
