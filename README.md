# bits of benjamin

Source for [bitsofbenjamin.com](https://bitsofbenjamin.com): a hand-rolled Jekyll site, built and hosted by GitHub Pages straight from `main`. No theme, no build workflow, one stylesheet.

## Writing a post

Every post lives in `_posts/` as `YYYY-MM-DD-some-title.md` and belongs to one section. Unfinished posts go in `_drafts/` (no date in the filename) and don't publish until you move them.

```yaml
---
title: The FJ cowl panel that left on the freeway
section: tinkering        # tinkering | kitchen | eating-out | reading
tags: [fj-cruiser, paint] # optional
summary: One line, shown on cards.
image: /assets/img/posts/fj-cowl.jpg   # optional cover photo
image_alt: The repainted cowl panel next to the windshield
easter_egg: The cowl is still out there on I-15.   # optional; title hover text + hidden ※ in the footer
---
```

Extra fields by section:

| section | fields | notes |
|---|---|---|
| `tinkering` | `tags` | Car posts get a car tag (`fj-cruiser`, `300cd`, `m850i`) so the Garage tile links to them. |
| `kitchen` | `cuisine`, `time_minutes`, `bake_time`, `serves` | `cuisine` drives the kitchen filter. `bake_time` is in minutes. The "Copy ingredients" button needs a `## Ingredients` heading with the bullet list directly under it. |
| `eating-out` | `place`, `cuisine`, `price`, `verdict` | `price` is `$` to `$$$$`. `place` takes one value or a list (`place: [SoCal, Taipei]`). Keep its spelling consistent (`SoCal`, `Taipei`, `Utah`); filters are built from the exact values. |
| `reading` | `tags` | |

Filter chips on each section page are generated from the values your posts use, so a new cuisine or place shows up automatically. Filters also work from the URL: `/eating-out/?place=Taipei`, `/tinkering/?tags=fj-cruiser`.

Photos go in `assets/img/posts/<post-slug>/`. Run `scripts/resize-photos` before committing: it shrinks any JPEG under `assets/img/posts/` to 1600px wide and strips EXIF (including GPS), in place. Photos it has already processed are skipped. Pass a directory or file to limit it.

## Editing the homepage

Most homepage content is in `_data/`, not HTML:

- `now.yml`: the Now card. Bump `updated` when you change it.
- `projects.yml`: project tiles. `status` is `live` or `tinkering`; one can be `featured`.
- `garage.yml`: the cars and the tag each one links to.
- `bookshelf.yml`: the reading tile.
- `sections.yml`: section names, numbers, blurbs and which filters each one has.

The hero copy is in the front matter of `index.html`. Colors and fonts are CSS variables at the top of `assets/css/site.css`.

## Running it locally

Needs Ruby and Bundler. If `bundle` isn't found, install it with `gem install --user-install bundler` and add its bin directory (`ruby -e 'print Gem.user_dir'` + `/bin`) to your `PATH`.

```sh
bundle install
bundle exec jekyll serve --drafts
```

Then open http://localhost:4000. `--drafts` shows drafts as if they were published.

## Hosting

GitHub Pages builds the site from `main` (Settings → Pages → Deploy from a branch → `main` / root). The custom domain comes from `CNAME`.

## Before launch

Delete `_posts/2025-10-16-sample-reading-notes.md` once a real reading post exists.
