# Contributing to LitElement

There are many ways to contribute to Lit! We welcome and truly appreciate contribution in all forms - issues and pull requests to the [main libraries](https://github.com/lit/lit), issues and pull requests to the [lit.dev site](https://github.com/lit/lit.dev), and of course we love to hear about any Lit components that you build to share with the community!

## Status of this repository

The main LitElement code has been moved into the [Lit monorepo](https://github.com/lit/lit). All new development is happening there. This repository is only for critical updates to `lit-element` 2.x.

## Logistics

### Communicating with the team

Beyond GitHub, we try to have a variety of different lines of communication open:

* [Blog](https://lit.dev/blog/)
* [Twitter](https://twitter.com/buildWithLit)
* [Slack channel](https://lit.dev/slack-invite/)

### Contributor License Agreement

You might notice our friendly CLA-bot commenting on a pull request you open if you haven't yet signed our CLA. We use the same CLA for all open-source Google projects, so you only have to sign it once. Once you complete the CLA, all your pull-requests will automatically get the `cla: yes` tag.

If you've already signed a CLA but are still getting bothered by the awfully insistent CLA bot, it's possible we don't have your GitHub username or you're using a different email address. Check the [information on your CLA](https://cla.developers.google.com/clas) or see this help article on [setting the email on your git commits](https://help.github.com/articles/setting-your-email-in-git/).

[Complete the CLA](https://cla.developers.google.com/clas)

## Contributing

### Contributing documentation

Docs source is in the `docs` folder. To build the site yourself, see the instructions in [docs/README.md](docs/README.md).

### Filing bugs

The Lit team heavily uses (and loves!) GitHub for all of our software management. We use GitHub issues to track all bugs and features.

If you find an issue, please do file it on the repository. The [lit-element issues](https://github.com/lit/lit-element/issues) should be used only for issues on the lit-element library itself - bugs somewhere in the core codebase.

Please file issues using the issue template provided, filling out as many fields as possible. We love examples for addressing issues - issues with a jsBin, Plunkr, jsFiddle, or glitch.me repro will be much easier for us to work on quickly. You can start with [this StackBlitz](https://stackblitz.com/edit/lit-element-example?file=index.js) which sets up the basics to demonstrate a lit-element.  If you need your repro to run in IE11, you can start from [this glitch](https://glitch.com/edit/#!/hello-lit-element?path=index.html:1:0), which serves the source via polyserve for automatic transpilation, although you must sign up for a glitch.me account to ensure your code persists for more than 5 days (note the glitch.me _editing environment_ is not compatible with IE11, however the "live" view link of the running code should work).

Occasionally we'll close issues if they appear stale or are too vague - please don't take this personally! Please feel free to re-open issues we've closed if there's something we've missed and they still need to be addressed.

### Contributing Pull Requests

PR's are even better than issues. We gladly accept community pull requests. In general across the core library and all of the elements, there are a few necessary steps before we can accept a pull request:

- Open an issue describing the problem that you are looking to solve in your PR (if one is not already open), and your approach to solving it. This makes it easier to have a conversation around the best general approach for solving your problem, outside of the code itself.
- Sign the [CLA](https://cla.developers.google.com/clas), as described above.
- Fork the repo you're making the fix on to your own GitHub account.
- Code!
- Ideally, squash your commits into a single commit with a clear message of what the PR does. If it absolutely makes sense to keep multiple commits, that's OK - or perhaps consider making two separate PR's.
- **Include tests that test the range of behavior that changes with your PR.** If you PR fixes a bug, make sure your tests capture that bug. If your PR adds new behavior, make sure that behavior is fully tested. Every PR *must* include associated tests. (See [Unit tests](#unit-tests) for more.)
- Submit your PR, making sure it references the issue you created.
- If your PR fixes a bug, make sure the issue includes clear steps to reproduce the bug so we can test your fix.

If you've completed all of these steps the core team will do its best to respond to the PR as soon as possible.

#### Contributing Code to LitElement

We follow the most common JavaScript and HTML style guidelines for how we structure our code - in general, look at the code and you'll know how to contribute! If you'd like a bit more structure, the [Google JavaScript Styleguide](https://google.github.io/styleguide/javascriptguide.xml) is a good place to start.

Lit also participates in Google's [Patch Rewards Program](https://www.google.com/about/appsecurity/patch-rewards/), where you can earn cold, hard cash for qualifying security patches to the Lit library. Visit the [patch rewards page](https://www.google.com/about/appsecurity/patch-rewards/) to find out more.

## Unit tests

### Running the lit-element unit tests

To run the lit-element unit tests:

1.  Clone the [lit-element repo](https://github.com/lit/lit-element).

2.  Install the dependencies:

		npm install

3.  Run the tests:

		npm test

To run individual test suites:

<code>npm test <var>path/to/suite</var></code>


### Configuring `web-component-tester`

By default, `npm test` runs tests on all installed browsers. You can configure it to run tests on a subset of available browsers, or to run tests remotely using Sauce Labs.

See the [`web-component-tester` README](https://github.com/Polymer/tools/tree/master/packages/web-component-tester) for information on configuring the test runner.
