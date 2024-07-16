'use strict';

import { Dimensions } from 'react-native';

export const TOPIC_WEB_VIEW_AUTO_HEIGHT = 'rnaw';
export const TOPIC_WEB_VIEW_AUTO_HEIGHT_STRING = `"${TOPIC_WEB_VIEW_AUTO_HEIGHT}"`;

const domMutationObserveScript = `
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(updateSize);
  observer.observe(document, {
    subtree: true,
    attributes: true
  });
`;

const updateSizeWithMessage = (element: string) =>
  `
  var lastHeight = 0;
  var heightTheSameTimes = 0;
  var maxHeightTheSameTimes = 5;
  var forceRefreshDelay = 1000;
  var forceRefreshTimeout;
  var checkPostMessageTimeout;

  function updateSize() {
    if (document.fullscreenElement) {
      return;
    }
    if (
      !window.hasOwnProperty('ReactNativeWebView') || 
      !window.ReactNativeWebView.hasOwnProperty('postMessage')
    ) {
      checkPostMessageTimeout = setTimeout(updateSize, 200);
      return;
    }

    clearTimeout(checkPostMessageTimeout);
    var result = ${element}.getBoundingClientRect()
    height = result.height + result.top;
    if(!height) {
      height = ${element}.offsetHeight || document.documentElement.offsetHeight
    }
    width = result.width;
    if(!width) {
      width = ${element}.offsetWidth || document.documentElement.offsetWidth
    }


    window.ReactNativeWebView.postMessage(JSON.stringify({ height: height, topic: ${TOPIC_WEB_VIEW_AUTO_HEIGHT_STRING} }));

    // Make additional height checks (required to fix issues wit twitter embeds)
    clearTimeout(forceRefreshTimeout);

    if (lastHeight !== height) {
      heightTheSameTimes = 1;
    } else {
      heightTheSameTimes++;
    }

    lastHeight = height;

    if (heightTheSameTimes <= maxHeightTheSameTimes) {
      forceRefreshTimeout = setTimeout(
        updateSize,
        heightTheSameTimes * forceRefreshDelay
      );
    }
  }
  `;

const setViewportContent = (width: number) => {
  return `
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=${width}, initial-scale=1.0 maximum-scale=1.0');
    document.getElementsByTagName("head")[0].appendChild(meta);
  `;
};

const getScript = (width: number) =>
  `
  var wrapper = document.getElementById("rnahw-wrapper");
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = 'rnahw-wrapper';
    while (document.body.firstChild instanceof Node) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
  }
  ${updateSizeWithMessage('wrapper')}
  window.addEventListener('load', updateSize);
  window.addEventListener('resize', updateSize);
  ${domMutationObserveScript}
  ${setViewportContent(width)}
  updateSize();
  `;

const getInjectedSource = ({
  html,
  script,
}: {
  html: string;
  script: string;
}) => `
  ${html}
  <script>
    ${script}
  </script>
`;

const appendContent = (html: string) => `${
  !html.includes('<!DOCTYPE html>') ? '<!DOCTYPE html>' : ''
}${!html.includes('<html>') ? '<html>' : ''}${
  !html.includes('<head>') ? '<head></head>' : ''
}${!html.includes('<style>') ? '<style></style>' : ''}${
  !html.includes('<body>') ? `<body>${html}</body>` : html
}${!html.includes('<html>') ? '</html>' : ''}
`;

export const reduceData = (
  html: string,
  width = Dimensions.get('window').width,
) => {
  const script = getScript(width);
  return getInjectedSource({ html: appendContent(html), script });
};

export const isSizeChanged = ({
  height,
  previousHeight,
}: {
  height: number;
  previousHeight: number;
}) => {
  if (!height) {
    return;
  }

  return height !== previousHeight;
};
