# CozyFocus Privacy Policy

**Last Updated:** December 2024

## Overview

CozyFocus is a Chrome extension designed to help users stay focused by blocking distracting websites and providing a cozy study dashboard.

## Data Collection

**CozyFocus stores all data locally on your device. No browsing history, personal information, or usage data is sent to external servers.**

### What We Store Locally

- Your list of blocked websites
- Focus session duration and statistics
- User preferences (dark mode, audio settings)

All of this data is stored using Chrome's local storage API (`chrome.storage.local`) and never leaves your device.

## Permissions Explained

### `storage`
Used to save your blocked website list and focus statistics locally on your device.

### `declarativeNetRequest` & `declarativeNetRequestWithHostAccess`
Used to block access to websites on your blocklist. This is done entirely locally and no browsing data is transmitted anywhere.

### `<all_urls>` (Host Permission)
Required to intercept and redirect requests to blocked websites. This permission enables the core blocking functionality but is only used for sites you explicitly add to your blocklist.

## Third-Party Services

CozyFocus does not use any third-party analytics, tracking, or data collection services.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date above.

## Contact

If you have any questions about this privacy policy, please open an issue on our GitHub repository.
