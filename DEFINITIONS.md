## Shared definitions

# Identity

Identity is coming from connectors and is a kind of user account in a specific data source.

This can be for example somebody's GitHub profile, git identity, Slack account, etc.

Identity can be claimed by a [user](#user). Single [user](#user) can have multiple identities in different data sources or even multiple identities of the same data source type.

Identity is unclaimed if it is not yet assigned to any [user](#user).

Identity can be marked as bot.

Identity have data source type and the following properties:
- Data source.
- Is bot flag.
- Email address (optional).
- Name (optional).
- User name (optional).
- Avatar URL (optional).

# User

User is a LFX profile. User will have LFID, user can claim [identities](#identity).


# Contributor

Contributor is defined as somebody who is making a [contribution](#contribution).

Contributor is either an unclaimed [identity](#identity) or a set of claimed [identities](#identity) (under a single [user](#user)).


# Contribution

Contribution is a kind of activity, depending on data source type.

We only consider activities on repositories that are not disabled and have Insights enabled.

Currently contribution is defined as any of the following:
- Authoring, Co-Authoring or committing a git commit.
- Creating/editinmg confluence page and/or attachment.
- Approving/Reviewing a Gerrit changeset/approval.
- Creating/Closing/Merging/Editing a gerrit changeset.
- Adding/Editing a gerrit comment.
- Creating/Committing a gerrit patchset.
- Creating/Closing/Editing a Github/Jira/Bugzilla issue.
- Commenting on a Gerrit/Jira/Bugzilla issue.
- GitHub/Jira/Buzzilla assignment.
- Creating/Closing/Merging/Editing a GitHub pull request.
- Github pull request assignment.
- Commenting on a GitHub pull request.
- Editing/Deleting a GitHub comment.
- Reviewing/Approving/Rejecting/Requesting changes on a GitHub pull request.
- Being requested a GitHub pull request reviewer.
- Pusher
- Watcher

We are *not* counting various reaction types (as GitHub reaction to comment/Issue/PR) as contributions.


# Contribution role

We use *contributor* table for this.

This table connects a given [identity](#identity) with a given [contribution](#contribution) (using *type_id* field specifying [contribution](#contribution) ID and *type* specifying contribution type like *commit*, *issue*, etc.).

This table also specifies [contribution](#contribution) *role*. So a typical record is like: a given [identity](#identity) authored (*role=author*) a given [commit](#commit) (*type_id=commit ID* and *type=commit*).

Some contributions also use *action* to distinguish between adding and for example editing or deleting contribution (*role* can be author in both cases, *type* and *type_id* the same, but *action* will differ).


# New contributor

New [contributor](#contributor) is somebody contributing his/her first [contribution](#contribution) in a specific time range (can also be for a specific [project](#project)).

This means that given [contributor](#contributor) should not have any [contributions](#contribution) before current time range start date (for a specific [project](#project) is we consider a given project's new contributors).


# Company affiliations

We have two types of company affiliations:
- [User company affiliation](#user-company-affiliation).
- [Virtual affiliation](#virtual-affiliation).


# User company affiliation

[User](#user) can have multiple company affiliations. Each affiliation has:
- Date range (affiliation starts at given date and ends on a given date). Both start and end date can be unlimited.
- Project (affiliations are specific to a project, so [user](#user) can have different company affiliations for different projects.
- Organization.

User affiliations are defined at the [user](#user) level, so they apply to all [user](#user)'s claimed [identities](#identity).


# Virtual affiliation

Virtual affiliations are defined only for unclaimed non-bot [identities](#identity).

So an [identity](#identity) cannot be a bot and cannot be linked to a [user](#user).

[Identity](#identity) is virtually affiliated to a company when [identity](#identity)'s email address domain matches organization domain defined in a special *org_domain* table.

Those *virtual affiliations* are not project specific and have no time ranges.

They are just helpers to allow finding more company affiliations.


# Repository

Repository is an abstraction defined for data source type.

This is currently a GitHub repository.

Repository belongs to a [project](#project).


# Project

A project is a way of defining hierarchy of projects tracked by Insight.

Project have a slug (for example *k8s*, *cncf*).

Projects are creating ahierarchy,e ach of them can have a parent project.

Parent project can for example be a foundation, like *CNCF* or *The Linux Foundation*.


# Commit

Commits come from git (not GitHub). Each commit will at least have:
- SHA (commith hash value).
- Repository.
- Author ([identity](#identity] who authored a given commit).
- Committer ([identity](#identity] who committed a given commit). Can be the same as author.
- Authored date (when commit was authored).
- Committed date (when commit was committed).
- Message.
- Doc/Merge commit flag.
- Authored/Committed dates in commit's timezone.
- Commit's timezone offset.
- Out of hours flag.
- Commit URL, branch.

Commist can also have so called *trailers* (additional roles), they are for example:
- Co-author(s).
- Signers.

Some projects (like *linux kernel*) use a lot more trailers (to support development in a similar way to GitHub), for example:
- Approved by.
- Tested by.
- Reviewed by.
- And many more.

We are not treating those additional trailers as [contributions](#contribution) currently.

When we count somebody's commits, we usually count number of distinct commit SHA hashes authored by a given [contributor](#contributor) in a given time range using authored date (unless specified otherwise).

When we count commits - we count distinct commits SHA hashes authored in a given time range.

Note that unless specified otherwise we count using copmmit's *author* and *authored date*.


# Commit files

Commits has commit files by type summaries. Each commit will have counts of lines added/removed, lines of code, files added/removed/modified aggregated by file types.

So for example 1 commit will have summary of all files added/deleted, lines of code stats aggregated per file type (so for json files, yaml files, go files, etc.).


# Issue

Issue can be a GitHub issue, Jira issue, Bugzilla bug.

Each issue will at least have:
- Type: GitHub/Jira/Bugzilla.
- Issue ID.
- Repository (in GitHub case).
- Action (there can be separate actions for the issue like created, updated, closed).
- Is Pull Request flag (in GitHub case, all PRs are also issues, so if you want to only see issues that are not PRs then you can use this flag).
- Timestamp (this is the time when given action happened - like issue was craeted, updated, closed).
- State (depending on data source type).

Issues also have dependent items. They are issue comments, issue assignees, and issue/issue comments reactions.

We are not treating any reactions (issue reaction, issue comment reaction) as [contributions](#contribution).

When we count somebody's issues, we count distinct issue IDs created (*action=created*) by a given [contributor](#contributor) within a given time range.

When we count issues in a given time period - we count distinct issue IDs that were created (*action=created*) in a given time range.

When we count issue *activities* it is possible to count different things (this will be specified in a given dashboard).
- We can count all issues where any activity happended within a given time range (count distinct issue IDs).
- We can count all activity IDs which happened in a given time range (activity ID can be for example comment ID, issue ID).
- We can count distinct activity IDs (so for example adding a comment and then editing it gives one activity ID) or just all activities (so adding and then editing a comment makes 2 activities).
- We can count opening, updating and closing an issue separately (3 activities) or as a one (as number of issues).
- To count issues closed we count only issues that were closed in a given time period (*action=close*).
- We can count number of comments (only distinct comments).


So there are many possible ways to count so-called *activities* and they will be specified in a given dashboard to avoid inconsistencies.


# Pull request

Pull request can be a GitHub PR or Gerrit changeset. Can be called *Code Change Request*.

Each PR will at least have:
- Type: GitHub/Gerrit.
- Pull request ID.
- Repository (in GitHub case).
- Action (there can be separate actions for the issue like created, updated, merged, closed).
- Timestamp (this is the time when given action happened - like issue was craeted, updated, closed).
- State (depending on data source type).

Pull request also have dependent items. They are pull request reviews, comments, pull request assignees, pull request requested reviewers, and PR/PR comments reactions.

We are not treating any reactions (PR reaction, PR comment reaction) as [contributions](#contribution).

When we count somebody's PRs, we count distinct PRs IDs created (*action=created*) by a given [contributor](#contributor) within a given time range.

When we count PRs in a given time period - we count distinct PRs IDs that were craeted (*action=created*) in a given time range. We can also count merged PRs (*action=merged*) or other action types (like closed).

When we count PR *activities* it is possible to count very different things (this will be specified in a given dashboard).
- We can count all PRs where any activity happended within a given time range (count distinct PR IDs where anything happened like created/closed/merged/added comment/approved/rejected/code change requested/comment reaction/requested reviewer/assigned...).
- We can count all activity IDs which happened in a given time range (activity ID can be for example comment ID, review ID, PR ID).
- We can count distinct activity IDs (so for example adding a review and then editing it gives one activity ID) or just all activities (so adding and then editing a review makes 2 activities).
- We can count opening, updating and merging a PR separately (3 activities) or as a one (as number of PRs).
- To count PRs merged we count only PRs that were merged in a given time period (*action=merged*).
- We can count number of comments (only distinct comments).
- We can count number of approvals (only distinct reviews that are approvals).
- We can count only distinct requested reviewers for PRs merged in a given time period for a specific [project](#project) (which can have multiople [repositories](#repository)).

So there are many possible ways to count so-called *activities* and they will be specified in a given dashboard to avoid inconsistencies.


# Reviewer

Reviewer is a [contributor](#contributor) who created at least 1 [PR](#pull-request) review.


# Pull request time to merge

Pull request time to merge is defined as follows:
- Average time in days for a [PR](#pull-request) from open to merge for PRs opened in a given time range. Can also be defined for PRs merged in a given time.


# Pull request lead time

Pull request lead time is defined as follows:
- Average time in days for a [PR](#pull-request) from open to merge for PRs opened in a given time range.
- We should only consider first-time [contributors](#contributor) - this means that if we calculate lead time for a PR in a given time period, then this [contributor](#contributor) should not have any [PR](#pull-request) [contributions](#contribution) before start of this time range.
- We should only consider first PR for any of such first-time contributoirs, so if a given new contributor opened more than 1 PR in this time range, we should only consider 1st PR.

This means we just calculate average time of first-time contributor's first time PRs to be accepted & merged in a given project.


# Average lead time by pull request size

FIXME: This could (in theory) be calculated if we have [PR](#pull-request) and [commit](#commit) connection in hour database (which we currently don't). If we have that data would would group by commit size (whcih we can calculate using [commit files by type](#commit-files)).

Another option to implemnt it would be to use PR labels (*kubernetes* assigns PR siz elabels to PRs like: x-small, small, medium, large, x-large, etc.). We currently have *labels* property on a [PR](#pull-request).


# Average wait time for 1st review

It is defined as average time in days (or hours) from [PR](#pull-request) creation to 1st review that is not just a comment (approval, change request or rejection).


# Average review time by pull request size

It is defined as average time in days (or hours) from [PR](#pull-request) review that is not just a comment (approval, change request or rejection) to merge.


# Drifting away contributors

Drifting away [contributor](#contributor) for a given time range D1-d2 and a project P (or globally) is a [contributor](#contributor) who:
- Was active in *{D1-1 year} - {D1- 6 months}* (was active in 1 year - 6 months before start date of current period) and had at least 10 contributions.
- Was not active in *{D1 - 6 months} - D2}* (was not active from 6 months before start of current period till end of current period).
- It is not important if that contributor was active or not after *D2*.
- If this is for a specific project *P* then we only consider that project *P* activity.


# Drifting away organization

Drifting away organization for a given time range D1-d2 and a project P (or globally) is an organization which:
- [Contribution](#contribution) is assigned to an organization if a [copntributor](#contributor) who made a given [contribution](#contribution) was affiliated (by user [company affiliation](#user-company-affiliation) or [virtual affiliation](#virtual-affiliation)) to a given organization at the time when [contribution](#contribution) was made.
- Was active in *{D1-1 year} - {D1- 6 months}* (was active in 1 year - 6 months before start date of current period) and had at least 10 contributions as defined above.
- Was not active in *{D1 - 6 months} - D2}* (was not active from 6 months before start of current period till end of current period).
- It is not important if that organization was active or not after *D2*.
- If this is for a specific project *P* then we only consider that project *P* activity.



