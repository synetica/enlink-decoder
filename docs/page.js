
(() => {
  "use strict";

  const STORAGE_KEY = "enlink-modbus-config-v1";
  const THEME_KEY = "enlink-theme";
  const SAMPLE_ROWS = [
    { deviceId: "1", regType: "Hold", address: "100", dataType: "U16", order: "HH", multiplier: "1", readingType: "Int" },
    { deviceId: "2", regType: "Input", address: "200", dataType: "F32", order: "HL", multiplier: "0.1", readingType: "Cum" },
    { deviceId: "0", regType: "", address: "", dataType: "", order: "", multiplier: "", readingType: "" }
  ];

  const state = {
    tool: "decoder",
    decoderTab: "hex",
    theme: loadTheme(),
    encoding: "hex",
    hexFormatting: "spaced",
    rows: []
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheDom();
    buildRows();
    wireToolSwitch();
    wireDecoderTabs();
    wireDecoderButtons();
    wireTheme();
    wireConfiguratorControls();
    preloadSamples();
    syncTheme();
    syncTool(state.tool);
    syncDecoderTab(state.decoderTab);
    syncEncodingControls();
    renderAllRows();
  }

  function cacheDom() {
    els.toolButtons = Array.from(document.querySelectorAll("[data-tool-target]"));
    els.toolPanels = Array.from(document.querySelectorAll("[data-tool-panel]"));
    els.decoderTabButtons = Array.from(document.querySelectorAll("[data-decoder-tab]"));
    els.decoderPanels = Array.from(document.querySelectorAll("[data-decoder-panel]"));
    els.themeToggle = document.getElementById("theme-toggle");
    els.themeIcon = document.getElementById("theme-toggle-icon");
    els.tableBody = document.getElementById("config-table-body");
    els.encodingButtons = Array.from(document.querySelectorAll("[data-encoding-choice]"));
    els.formatButtons = Array.from(document.querySelectorAll("[data-format-choice]"));
    els.hexFormatToggle = document.getElementById("hex-format-toggle");
    els.copyTabDelimited = document.getElementById("copy-tab-delimited");
    els.saveConfig = document.getElementById("save-config");
    els.loadConfig = document.getElementById("load-config");
    els.loadSample = document.getElementById("load-sample");
    els.clearConfig = document.getElementById("clear-config");
    els.configFeedback = document.getElementById("config-feedback");
  }

  function loadTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  }

  function wireTheme() {
    if (!els.themeToggle) return;
    els.themeToggle.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, state.theme); } catch {}
      syncTheme();
    });
  }

  function syncTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    if (!els.themeToggle || !els.themeIcon) return;
    els.themeToggle.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
    els.themeToggle.title = state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    els.themeIcon.textContent = state.theme === "dark" ? "☀" : "☾";
  }

  function wireToolSwitch() {
    els.toolButtons.forEach((button) => {
      button.addEventListener("click", () => syncTool(button.dataset.toolTarget === "configurator" ? "configurator" : "decoder"));
    });
  }

  function syncTool(tool) {
    state.tool = tool;
    els.toolButtons.forEach((button) => {
      const active = button.dataset.toolTarget === tool;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    els.toolPanels.forEach((panel) => {
      const active = panel.dataset.toolPanel === tool;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function wireDecoderTabs() {
    els.decoderTabButtons.forEach((button) => {
      button.addEventListener("click", () => syncDecoderTab(button.dataset.decoderTab === "base64" ? "base64" : "hex"));
    });
  }

  function syncDecoderTab(tab) {
    state.decoderTab = tab;
    els.decoderTabButtons.forEach((button) => {
      const active = button.dataset.decoderTab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    els.decoderPanels.forEach((panel) => {
      const active = panel.dataset.decoderPanel === tab;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  function wireDecoderButtons() {
    const decodeBytesBtn = document.getElementById("decode-bytes-btn");
    const decodeBase64Btn = document.getElementById("decode-base64-btn");
    if (decodeBytesBtn) decodeBytesBtn.addEventListener("click", () => { if (typeof decode_bytes === "function") decode_bytes(); });
    if (decodeBase64Btn) decodeBase64Btn.addEventListener("click", () => { if (typeof decode_base64 === "function") decode_base64(); });
  }

  function wireConfiguratorControls() {
    els.encodingButtons.forEach((button) => button.addEventListener("click", () => {
      state.encoding = button.dataset.encodingChoice === "base64" ? "base64" : "hex";
      syncEncodingControls();
      renderAllRows();
    }));

    els.formatButtons.forEach((button) => button.addEventListener("click", () => {
      state.hexFormatting = button.dataset.formatChoice === "compact" ? "compact" : "spaced";
      syncEncodingControls();
      renderAllRows();
    }));

    els.tableBody.addEventListener("input", onTableInput);
    els.tableBody.addEventListener("click", onTableClick);
    els.copyTabDelimited.addEventListener("click", copyTabDelimited);
    els.saveConfig.addEventListener("click", saveConfiguration);
    els.loadConfig.addEventListener("click", loadConfiguration);
    els.loadSample.addEventListener("click", loadSampleConfiguration);
    els.clearConfig.addEventListener("click", clearConfiguration);
  }

  function syncEncodingControls() {
    els.encodingButtons.forEach((button) => {
      const active = button.dataset.encodingChoice === state.encoding;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    els.formatButtons.forEach((button) => {
      const active = button.dataset.formatChoice === state.hexFormatting;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.disabled = state.encoding === "base64";
    });
    if (els.hexFormatToggle) {
      els.hexFormatToggle.style.opacity = state.encoding === "base64" ? "0.55" : "1";
    }
  }

  function buildRows() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 32; i += 1) {
      const row = {
        item: i + 1,
        deviceId: "",
        regType: "",
        address: "",
        dataType: "",
        order: "",
        multiplier: "",
        readingType: "",
        status: ""
      };
      state.rows.push(row);
      const tr = document.createElement("tr");
      tr.dataset.rowIndex = String(i);
      tr.innerHTML = `
        <td class="item-cell">${row.item}</td>
        <td class="status-cell"><span class="status-pill" data-role="status"></span></td>
        <td class="dup-cell"><button type="button" class="copy-icon-btn" data-copy-above title="Copy config from above" aria-label="Copy config from above">⎘</button></td>
        <td><input class="row-input" data-field="deviceId" inputmode="numeric" autocomplete="off" title="Enter 0 to 247 - Use 0 to delete this item in the enLink device" /></td>
        <td><input class="row-input" data-field="regType" list="reg-type-options" autocomplete="off" /></td>
        <td><input class="row-input" data-field="address" inputmode="numeric" autocomplete="off" /></td>
        <td><input class="row-input" data-field="dataType" list="data-type-options" autocomplete="off" /></td>
        <td><input class="row-input" data-field="order" list="order-options" autocomplete="off" /></td>
        <td><input class="row-input" data-field="multiplier" inputmode="decimal" autocomplete="off" /></td>
        <td><input class="row-input" data-field="readingType" list="reading-type-options" autocomplete="off" /></td>
        ${outputCell("setConfig")}
        ${outputCell("queryConfig")}
        ${outputCell("queryValue")}
      `;
      frag.appendChild(tr);
    }
    els.tableBody.appendChild(frag);
  }

  function outputCell(key) {
    return `
      <td>
        <div class="output-box">
          <div class="output-scroll" data-output-value="${key}"></div>
          <button type="button" class="output-copy-btn" data-copy-output="${key}" title="Copy">⧉</button>
        </div>
      </td>`;
  }

  function preloadSamples() {
    SAMPLE_ROWS.forEach((sample, idx) => Object.assign(state.rows[idx], sample));
    applyRowsToInputs();
  }

  function applyRowsToInputs() {
    const trs = Array.from(els.tableBody.querySelectorAll("tr"));
    trs.forEach((tr, index) => {
      const row = state.rows[index];
      tr.querySelectorAll("[data-field]").forEach((input) => {
        const field = input.dataset.field;
        input.value = row[field] || "";
      });
    });
  }

  function onTableInput(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const tr = input.closest("tr");
    if (!tr) return;
    const row = state.rows[Number(tr.dataset.rowIndex)];
    const field = input.dataset.field;
    if (!row || !field) return;
    row[field] = input.value;
    computeRow(row);
    renderRow(tr, row);
  }

  function onTableClick(event) {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const copyAboveBtn = target.closest("[data-copy-above]");
    if (copyAboveBtn) {
      const tr = copyAboveBtn.closest("tr");
      if (!tr) return;
      const idx = Number(tr.dataset.rowIndex);
      if (idx > 0) {
        const src = state.rows[idx - 1];
        const dst = state.rows[idx];
        ["deviceId", "regType", "address", "dataType", "order", "multiplier", "readingType"].forEach((field) => {
          dst[field] = String(src[field] || "");
        });
        applyRowsToInputs();
        renderAllRows();
        flashAction(copyAboveBtn, "Copied row from above", "success");
      }
      return;
    }

    const copyOutputBtn = target.closest("[data-copy-output]");
    if (copyOutputBtn) {
      const tr = copyOutputBtn.closest("tr");
      if (!tr) return;
      const row = state.rows[Number(tr.dataset.rowIndex)];
      const key = copyOutputBtn.dataset.copyOutput;
      const bytes = key === "setConfig" ? row._setBytes : key === "queryConfig" ? row._queryConfigBytes : row._queryValueBytes;
      const text = formatOutput(bytes || []);
      if (!text) return;
      copyText(text).then(() => flashAction(copyOutputBtn, "Command copied", "success"));
    }
  }

  function renderAllRows() {
    Array.from(els.tableBody.querySelectorAll("tr")).forEach((tr, index) => {
      const row = state.rows[index];
      computeRow(row);
      renderRow(tr, row);
    });
  }

  function renderRow(tr, row) {
    const statusEl = tr.querySelector("[data-role='status']");
    statusEl.textContent = row.status;
    statusEl.dataset.status = row.status;

    tr.querySelectorAll("[data-field]").forEach((input) => {
      const field = input.dataset.field;
      input.classList.toggle("has-error", Boolean(row._errors && row._errors[field]));
    });

    ["setConfig", "queryConfig", "queryValue"].forEach((key) => {
      const el = tr.querySelector(`[data-output-value='${key}']`);
      const bytes = key === "setConfig" ? row._setBytes : key === "queryConfig" ? row._queryConfigBytes : row._queryValueBytes;
      el.textContent = formatOutput(bytes || []);
    });
  }

  function computeRow(row) {
    const raw = {
      deviceId: row.deviceId.trim(),
      regType: row.regType.trim(),
      address: row.address.trim(),
      dataType: row.dataType.trim(),
      order: row.order.trim(),
      multiplier: row.multiplier.trim(),
      readingType: row.readingType.trim()
    };

    row._errors = {};
    row._setBytes = [];
    row._queryConfigBytes = [];
    row._queryValueBytes = [];

    const values = Object.values(raw);
    const filledCount = values.filter((value) => value !== "").length;
    const allBlank = filledCount === 0;
    const anyBlank = filledCount < values.length;

    if (allBlank) {
      row.status = "Empty";
      return;
    }

    const deviceId = parseStrictInt(raw.deviceId);
    if (raw.deviceId !== "" && deviceId === 0) {
      ["regType", "address", "dataType", "order", "multiplier", "readingType"].forEach((field) => {
        if (raw[field] !== "") row._errors[field] = true;
      });
      row.status = Object.keys(row._errors).length ? "ERR" : "Delete";
      if (row.status === "Delete") {
        row._setBytes = [0xFC, 0x41, 0x7F, row.item];
        row._queryConfigBytes = [0xFE, 0x41, row.item];
        row._queryValueBytes = [0xFC, 0x42, 0x01, row.item];
      }
      return;
    }

    if (anyBlank) {
      row.status = "";
      return;
    }

    const regType = mapRegisterType(raw.regType);
    const address = parseStrictInt(raw.address);
    const dataType = mapDataType(raw.dataType);
    const wordCount = mapWordCount(raw.dataType);
    const order = mapOrder(raw.order);
    const multiplierBytes = float32Bytes(raw.multiplier);
    const readingType = mapReadingType(raw.readingType);

    if (!(Number.isInteger(deviceId) && deviceId >= 1 && deviceId <= 247)) row._errors.deviceId = true;
    if (regType === null) row._errors.regType = true;
    if (!(Number.isInteger(address) && address >= 0 && address <= 65535)) row._errors.address = true;
    if (dataType === null || wordCount === null) row._errors.dataType = true;
    if (order === null) row._errors.order = true;
    if (multiplierBytes === null) row._errors.multiplier = true;
    if (readingType === null) row._errors.readingType = true;

    if (Object.keys(row._errors).length) {
      row.status = "ERR";
      return;
    }

    row.status = "OK";
    row._setBytes = [0xFD, 0x41, row.item, deviceId, regType, (address >> 8) & 0xFF, address & 0xFF, dataType, wordCount, order, ...multiplierBytes, readingType];
    row._queryConfigBytes = [0xFE, 0x41, row.item];
    row._queryValueBytes = [0xFC, 0x42, 0x01, row.item];
  }

  function mapRegisterType(value) {
    if (!value) return null;
    const v = value.trim().toUpperCase();
    if (v.startsWith("H")) return 0x03;
    if (v.startsWith("I")) return 0x04;
    return null;
  }

  function mapDataType(value) {
    if (!value) return null;
    const v = value.trim().toUpperCase();
    if (v.startsWith("U")) return 0x00;
    if (v.startsWith("S")) return 0x01;
    if (v.startsWith("F")) return 0x02;
    return null;
  }

  function mapWordCount(value) {
    if (!value) return null;
    const v = value.trim();
    if (v.endsWith("16")) return 0x01;
    if (v.endsWith("32")) return 0x02;
    if (v.endsWith("64")) return 0x04;
    return null;
  }

  function mapOrder(value) {
    const map = { HH: 0x00, HL: 0x01, LH: 0x02, LL: 0x03 };
    return map[(value || "").trim().toUpperCase()] ?? null;
  }

  function mapReadingType(value) {
    if (!value) return null;
    const v = value.trim().toUpperCase();
    if (v.startsWith("I")) return 0x00;
    if (v.startsWith("C")) return 0x01;
    return null;
  }

  function float32Bytes(value) {
    if (value === "") return null;
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    const view = new DataView(new ArrayBuffer(4));
    view.setFloat32(0, num, false);
    return [view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)];
  }

  function parseStrictInt(value) {
    if (!/^-?\d+$/.test(value)) return null;
    return Number(value);
  }

  function formatOutput(bytes) {
    if (!bytes || !bytes.length) return "";
    if (state.encoding === "base64") return bytesToBase64(bytes);
    const hex = bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
    return state.hexFormatting === "compact" ? hex.join("") : hex.join(" ");
  }

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  function copyTabDelimited() {
    const lines = state.rows
      .filter((row) => row.status === "OK" || row.status === "Delete")
      .map((row) => [row.item, row.deviceId, row.regType, row.address, row.dataType, row.order, row.multiplier, row.readingType].join("\t"));
    if (!lines.length) {
      flashAction(els.copyTabDelimited, "No OK/Delete rows to copy", "error");
      return;
    }
    copyText(lines.join("\n")).then(() => flashAction(els.copyTabDelimited, "Tab-delimited rows copied", "success"));
  }

  function saveConfiguration() {
    try {
      const rows = state.rows.map(({ item, status, _errors, _setBytes, _queryConfigBytes, _queryValueBytes, ...persistable }) => persistable);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      flashAction(els.saveConfig, "Configuration saved locally", "success");
    } catch {
      flashAction(els.saveConfig, "Could not save configuration", "error");
    }
  }

  function loadConfiguration() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { flashAction(els.loadConfig, "No saved configuration found", "error"); return; }
      const rows = JSON.parse(raw);
      if (!Array.isArray(rows)) { flashAction(els.loadConfig, "Saved data is invalid", "error"); return; }
      state.rows.forEach((row, index) => {
        const src = rows[index] || {};
        row.deviceId = String(src.deviceId || "");
        row.regType = String(src.regType || "");
        row.address = String(src.address || "");
        row.dataType = String(src.dataType || "");
        row.order = String(src.order || "");
        row.multiplier = String(src.multiplier || "");
        row.readingType = String(src.readingType || "");
      });
      applyRowsToInputs();
      renderAllRows();
      flashAction(els.loadConfig, "Configuration loaded", "success");
    } catch {
      flashAction(els.loadConfig, "Could not load configuration", "error");
    }
  }

  function loadSampleConfiguration() {
    clearRows(false);
    SAMPLE_ROWS.forEach((sample, idx) => Object.assign(state.rows[idx], sample));
    applyRowsToInputs();
    renderAllRows();
    flashAction(els.loadSample, "Sample rows loaded", "success");
  }

  function clearConfiguration() {
    clearRows(true);
    applyRowsToInputs();
    renderAllRows();
    flashAction(els.clearConfig, "Configuration cleared", "success");
  }

  function clearRows(clearSaved) {
    state.rows.forEach((row) => {
      row.deviceId = "";
      row.regType = "";
      row.address = "";
      row.dataType = "";
      row.order = "";
      row.multiplier = "";
      row.readingType = "";
    });
    /*
    if (clearSaved) {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
      */
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.top = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      try {
        document.execCommand("copy");
        helper.remove();
        resolve();
      } catch (error) {
        helper.remove();
        reject(error);
      }
    });
  }

  function flashAction(element, text, tone = "info") {
    setFeedback(text, tone);
    if (!element) return;
    element.classList.add("is-busy");
    window.setTimeout(() => {
      element.classList.remove("is-busy");
    }, 240);
  }

  let feedbackTimer = 0;
  function setFeedback(text, tone = "info") {
    if (!els.configFeedback) return;
    window.clearTimeout(feedbackTimer);
    els.configFeedback.textContent = text || "";
    els.configFeedback.className = "config-feedback" + (tone ? ` is-${tone}` : "");
    if (text) {
      feedbackTimer = window.setTimeout(() => {
        if (!els.configFeedback) return;
        els.configFeedback.textContent = "";
        els.configFeedback.className = "config-feedback";
      }, 1800);
    }
  }
})();
