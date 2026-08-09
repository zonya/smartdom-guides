---
title: "Sidecar Travel: use an iPad as a headless Mac's display, automatically"
description: "A small open-source macOS tool that brings up Sidecar on its own when an iPad is plugged in, so a Mac with no monitor is usable the moment you sit down with it."
pubDate: 2026-08-10
tags: ["macos", "open-source", "sidecar"]
lang: en
---

If you travel with a Mac mini, you know the problem. The machine has no display of its own. You have an iPad in the bag, and macOS can already use an iPad as a screen through **Sidecar** — but only if you can *see* the menu bar to turn it on. Which you cannot, because there is no screen.

**Sidecar Travel** solves exactly that one thing: plug the iPad in, and Sidecar comes up by itself.

It is free, MIT-licensed, and lives at [github.com/zonya/sidecar-travel](https://github.com/zonya/sidecar-travel).

## What it does

A small menu-bar agent watches for a specific iPad over USB. When that iPad appears, it asks macOS to start a Sidecar session with it. When the iPad is unplugged, it tears the session down again.

That is the whole feature. There is no window management, no streaming stack, no configuration file to learn — Sidecar itself is doing all the real work. The tool only presses the button you cannot reach.

## Why USB and not Wi-Fi

Sidecar works wirelessly, and that is genuinely nicer when both devices are on a network you trust. But the case this tool was built for is the one where **there is no such network yet**: a hotel room, an apartment abroad, a car. USB needs nothing to be configured first, adds no latency, and charges the iPad while you work.

There is a second reason. Wireless Sidecar depends on both devices seeing each other over Bluetooth and Wi-Fi, and that discovery is exactly what tends to fail on unfamiliar networks with client isolation turned on. A cable does not have opinions.

## What it is not

Being clear about this saves you time:

- **It is not a remote desktop.** Sidecar requires the Mac and the iPad to be physically together and signed into the same Apple ID. If you want to reach a Mac from another country, you want VNC or Screen Sharing, not this.
- **It is not a fix for a Mac that will not boot.** The Mac has to reach the desktop for Sidecar to exist at all. For a machine that hangs before that, you still need a real display or a headless HDMI dongle.
- **It does not add a display that persists after unplugging.** When the iPad goes, the screen goes.

## The part that surprised us

macOS has no public API for starting a Sidecar session. There is no `sidecarctl`, no scripting dictionary, no documented entry point at all — which is presumably why nobody had shipped this.

What does exist is the private framework behind the menu-bar item. Driving it means talking to `SidecarCore`, and that has two consequences worth knowing before you rely on this tool:

1. **It can break on any macOS update.** A private framework carries no compatibility promise. In practice it has been stable, but that is luck rather than a guarantee.
2. **It needs permission you have to grant by hand.** The agent has to be allowed to control the Mac, and macOS will ask you for that once, in System Settings.

We mention this openly because a tool built on a private API and described as if it were supported is how people end up with a broken setup on the first morning of a trip.

## Installing

The project ships as a plain macOS app bundle built with `swiftc` — no Xcode project, no dependencies. The README has the current build and install steps, and it stays more accurate than a blog post can:

**[github.com/zonya/sidecar-travel](https://github.com/zonya/sidecar-travel)**

You will need to name the iPad you want it to react to, so a second iPad in the same bag does not hijack the screen.

## Localization

The interface ships in English and Serbian. If you want it in your language, that is one of the easiest possible contributions: copy `Resources/en.lproj` to a new folder, translate the strings file, add the language code to `Info.plist`, and open a pull request. No Swift required.

## If it saved you an afternoon

This exists because we needed it, and it is free because that costs nothing extra. If it turned out to be useful to you, [a coffee](https://ko-fi.com/zonya2026) is a nice way to say so — and a bug report with your macOS version is worth more than the coffee.
