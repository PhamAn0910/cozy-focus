# Window Seat Privacy Policy

**Last Updated:** January 2026

## Overview

Window Seat is a Chrome extension designed to help users stay focused by blocking distracting websites, providing a cozy study dashboard, and offering 40Hz focus audio.

## Data Collection

**Window Seat stores all data locally on your device. No browsing history, personal information, or usage data is sent to external servers.**

### What We Store Locally

- Your list of blocked websites
- Focus session state (active/inactive, start time, duration)
- User preferences (audio settings, new tab replacement preference)

All of this data is stored using Chrome's storage API (`chrome.storage.sync` and `chrome.storage.local`) and never leaves your device.

## Permissions Explained

### `storage`
Used to save your blocked website list, focus session state, and user preferences locally on your device.

### `declarativeNetRequest` & `declarativeNetRequestWithHostAccess`
Used to block access to websites on your blocklist. This is done entirely locally and no browsing data is transmitted anywhere.

### `alarms`
Used to manage focus session timers and track elapsed time. No data is sent externally.

### `tabs`
Used to optionally replace your new tab page with the Window Seat dashboard. This only activates when you enable the "Replace New Tab" setting.

### `<all_urls>` (Host Permission)
Required to intercept and redirect requests to blocked websites. This permission enables the core blocking functionality but is only used for sites you explicitly add to your blocklist.

## Third-Party Services

Window Seat does not use any third-party analytics, tracking, or data collection services.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date above.

## Contact

If you have any questions about this privacy policy, please open an issue on our GitHub repository.
