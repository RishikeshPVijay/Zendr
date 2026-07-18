import type { Peer } from '@zendr/protocol';

const TABLET_REGEX = /iPad|Tablet|PlayBook|Silk/i;
const MOBILE_REGEX = /Mobi|iPhone|iPod/i;
const TV_REGEX =
  /SmartTV|SMART-TV|GoogleTV|Android TV|AppleTV|Apple TV|HbbTV|NetCast|Web0S|WebOS|Tizen|Roku|AFT|BRAVIA|Viera|TV/i;

const ANDROID_REGEX = /Android/i;
const IOS_REGEX = /iPhone|iPad|iPod/i;
const LINUX_REGEX = /Linux/i;
const MAC_REGEX = /Mac/i;
const WINDOWS_REGEX = /Win/i;

const CHROME_REGEX = /Chrome|CriOS/i;
const EDGE_REGEX = /Edg|EdgiOS/i;
const FIREFOX_REGEX = /Firefox|FxiOS/i;
const OPERA_REGEX = /OPR|Opera|OPiOS/i;
const SAFARI_REGEX = /Safari/i;

function getDeviceType(): Peer['deviceType'] {
  const ua = navigator.userAgent;

  if (TV_REGEX.test(ua)) {
    return 'tv';
  }

  if (TABLET_REGEX.test(ua)) {
    return 'tablet';
  }

  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) {
    return 'tablet';
  }

  if (MOBILE_REGEX.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

function getOS(): Peer['os'] {
  const platform = navigator.userAgent;

  if (ANDROID_REGEX.test(platform)) {
    return 'Android';
  }

  if (IOS_REGEX.test(platform)) {
    return 'iOS';
  }

  if (LINUX_REGEX.test(platform)) {
    return 'Linux';
  }

  if (MAC_REGEX.test(platform)) {
    return 'macOS';
  }

  if (WINDOWS_REGEX.test(platform)) {
    return 'Windows';
  }

  return 'Unknown';
}

function getBrowser(): Peer['browser'] {
  const ua = navigator.userAgent;

  if (EDGE_REGEX.test(ua)) {
    return 'Edge';
  }

  if (OPERA_REGEX.test(ua)) {
    return 'Opera';
  }

  if (CHROME_REGEX.test(ua)) {
    return 'Chrome';
  }

  if (FIREFOX_REGEX.test(ua)) {
    return 'Firefox';
  }

  if (SAFARI_REGEX.test(ua)) {
    return 'Safari';
  }

  return 'Unknown';
}

export function getDeviceInfo() {
  return {
    browser: getBrowser(),
    deviceType: getDeviceType(),
    os: getOS(),
  };
}
