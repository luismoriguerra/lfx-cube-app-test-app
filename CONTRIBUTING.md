# Contributing Guide

The LFX Insights project accepts contributions via [GitHub pull requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests). This document outlines the process to help get your contribution accepted.

## Issues and discussions

Feature requests, bug reports, and support requests all occur through GitHub issues and discussions. If you would like to file an issue, view existing issues, or comment on an issue please engage with issues at <https://github.com/LF-Engineering/lfx-insights-ui/issues>.

## Pull Requests

All changes to the source code and documentation are made through [GitHub pull requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests). If you would like to make a change to the source, documentation, or other component in the repository please open a pull request with the change.

If you are unsure if the change will be welcome you may want to file an issue first. The issue can detail the change and you can get feedback from the maintainers prior to starting to make the change.

You can find the existing pull requests at <https://github.com/LF-Engineering/lfx-insights-ui/pulls>.

## Getting started

You can get some information about the project's **architecture** and how to set up the **development environment** in the following documents:

- [Architecture](https://github.com/LF-Engineering/lfx-insights-ui/wiki/Structure)
- [Development environment setup](https://github.com/LF-Engineering/lfx-insights-ui/wiki/getting-started)

## Developer Certificate of Origin

The LFX Insights project uses a [Developers Certificate of Origin (DCO)](https://developercertificate.org/) to sign-off that you have the right to contribute the code being contributed.

Every commit needs to have signoff added to it with a message like:

```text
Signed-off-by: Joe Smith <joe.smith@example.com>
```

Git makes doing this fairly straight forward. First, please use your real name (sorry, no pseudonyms or anonymous contributions).

If you set your `user.name` and `user.email` in your git configuration, you can sign your commit automatically with `git commit -s` or `git commit --signoff`.

Signed commits in the git log will look something like:

```text
Author: Joe Smith <joe.smith@example.com>
Date:   Thu Feb 2 11:41:15 2018 -0800

    Update README

    Signed-off-by: Joe Smith <joe.smith@example.com>
```

Notice how the `Author` and `Signed-off-by` lines match. If they do not match the PR will be rejected by the automated DCO check.

If more than one person contributed to a commit than there can be more than one `Signed-off-by` line where each line is a signoff from a different person who contributed to the commit.
