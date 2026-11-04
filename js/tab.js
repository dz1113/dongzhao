/**
 * Tab 选项卡切换模块（可复用）
 *
 * 使用方式：
 *   TabSwitcher.init('.tab-nav', { defaultTab: 'domestic' });
 *
 * HTML 结构要求：
 *   1. 按钮容器：带 data-tab-group="xxx" 的元素
 *   2. 按钮：.tab-btn + data-tab="标识"
 *   3. 面板：.tab-panel + data-panel="标识"
 */
(function (global) {
    'use strict';

    var TabSwitcher = {

        /**
         * 初始化 Tab 切换
         * @param {string|Element} navSelector  - 按钮容器选择器或元素
         * @param {object} options              - 配置项
         * @param {string} options.defaultTab   - 默认激活的 tab 标识（data-tab 值）
         */
        init: function (navSelector, options) {
            var nav = typeof navSelector === 'string'
                ? document.querySelector(navSelector)
                : navSelector;

            if (!nav) {
                console.warn('TabSwitcher: 未找到 Tab 导航容器');
                return;
            }

            options = options || {};
            var defaultTab = options.defaultTab || null;

            // 绑定按钮点击事件（使用事件委托，可复用）
            nav.addEventListener('click', function (e) {
                var btn = e.target.closest('.tab-btn');
                if (!btn) return;

                var tabKey = btn.getAttribute('data-tab');
                switchTab(nav, tabKey);
            });

            // 如果有指定的默认 tab，初始化激活状态
            if (defaultTab) {
                activateDefault(nav, defaultTab);
            } else {
                // 没有指定时，激活第一个已带 active 的按钮，或第一个按钮
                var firstActive = nav.querySelector('.tab-btn.active');
                if (firstActive) {
                    switchTab(nav, firstActive.getAttribute('data-tab'));
                } else {
                    var firstBtn = nav.querySelector('.tab-btn');
                    if (firstBtn) {
                        switchTab(nav, firstBtn.getAttribute('data-tab'));
                    }
                }
            }
        },

        /**
         * 手动切换到指定 tab（暴露接口，可外部调用）
         * @param {string|Element} navSelector - 按钮容器选择器或元素
         * @param {string} tabKey              - 目标 tab 标识
         */
        switchTo: function (navSelector, tabKey) {
            var nav = typeof navSelector === 'string'
                ? document.querySelector(navSelector)
                : navSelector;
            if (nav) switchTab(nav, tabKey);
        }
    };

    /**
     * 内部核心切换逻辑
     * 先清除所有选中状态，再设置当前元素选中状态
     */
    function switchTab(nav, tabKey) {
        var tabGroup = nav.getAttribute('data-tab-group');
        var content = nav.nextElementSibling;

        // 1. 清除所有 tab 按钮的选中状态
        var allBtns = nav.querySelectorAll('.tab-btn');
        allBtns.forEach(function (btn) {
            btn.classList.remove('active');
        });

        // 2. 清除所有面板的选中状态
        if (content) {
            var allPanels = content.querySelectorAll('.tab-panel');
            allPanels.forEach(function (panel) {
                panel.classList.remove('active');
            });
        }

        // 3. 设置当前按钮为选中状态
        var currentBtn = nav.querySelector('.tab-btn[data-tab="' + tabKey + '"]');
        if (currentBtn) {
            currentBtn.classList.add('active');
        }

        // 4. 设置当前面板为选中状态
        if (content) {
            var currentPanel = content.querySelector('.tab-panel[data-panel="' + tabKey + '"]');
            if (currentPanel) {
                currentPanel.classList.add('active');
            }
        }
    }

    /**
     * 激活指定的默认 tab
     */
    function activateDefault(nav, defaultTab) {
        // 先清除 HTML 中写死的 active，统一由 JS 控制
        var allBtns = nav.querySelectorAll('.tab-btn');
        allBtns.forEach(function (btn) {
            btn.classList.remove('active');
        });

        var content = nav.nextElementSibling;
        if (content) {
            var allPanels = content.querySelectorAll('.tab-panel');
            allPanels.forEach(function (panel) {
                panel.classList.remove('active');
            });
        }

        // 再设置指定的默认 tab
        switchTab(nav, defaultTab);
    }

    // 暴露到全局
    global.TabSwitcher = TabSwitcher;

})(window);

/* ============================
 * 页面加载后自动初始化
 * ============================ */
document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有 Tab 组，默认激活"国内新闻"
    TabSwitcher.init('.tab-nav', { defaultTab: 'domestic' });
});
