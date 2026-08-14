"use client";

import React, { useState } from "react";
import { CloseIcon, RulerIcon, CheckIcon } from "@/components/Icons";
import styles from "./SizeGuideModal.module.css";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [tab, setTab] = useState<"fan" | "player">("fan");

  if (!isOpen) return null;

  const fanData = [
    { size: "S", chestIn: '36" - 38"', lengthIn: '27"', chestCm: "92 - 96 cm", lengthCm: "69 cm" },
    { size: "M", chestIn: '38" - 40"', lengthIn: '28"', chestCm: "96 - 102 cm", lengthCm: "71 cm" },
    { size: "L", chestIn: '40" - 42"', lengthIn: '29"', chestCm: "102 - 108 cm", lengthCm: "74 cm" },
    { size: "XL", chestIn: '42" - 44"', lengthIn: '30"', chestCm: "108 - 114 cm", lengthCm: "76 cm" },
    { size: "XXL", chestIn: '44" - 46"', lengthIn: '31"', chestCm: "114 - 120 cm", lengthCm: "79 cm" },
  ];

  const playerData = [
    { size: "S", chestIn: '34" - 36"', lengthIn: '27"', chestCm: "88 - 92 cm", lengthCm: "69 cm" },
    { size: "M", chestIn: '36" - 38"', lengthIn: '28"', chestCm: "92 - 98 cm", lengthCm: "71 cm" },
    { size: "L", chestIn: '38" - 40"', lengthIn: '29"', chestCm: "98 - 104 cm", lengthCm: "74 cm" },
    { size: "XL", chestIn: '40" - 42"', lengthIn: '30"', chestCm: "104 - 110 cm", lengthCm: "76 cm" },
    { size: "XXL", chestIn: '42" - 44"', lengthIn: '31"', chestCm: "110 - 116 cm", lengthCm: "79 cm" },
  ];

  const currentData = tab === "fan" ? fanData : playerData;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconCircle}>
              <RulerIcon size={20} />
            </div>
            <div>
              <h3 className={styles.title}>Official Jersey Size Guide</h3>
              <p className={styles.subtitle}>Standard measurements across Bangladeshi & International fits</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close size guide">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className={styles.controls}>
          {/* Fan vs Player version tab */}
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tabBtn} ${tab === "fan" ? styles.tabActive : ""}`}
              onClick={() => setTab("fan")}
            >
              Fan Version (Regular Fit)
            </button>
            <button
              className={`${styles.tabBtn} ${tab === "player" ? styles.tabActive : ""}`}
              onClick={() => setTab("player")}
            >
              Player Issue (Slim Fit)
            </button>
          </div>

          {/* Unit Toggle */}
          <div className={styles.unitToggle}>
            <button
              className={`${styles.unitBtn} ${unit === "in" ? styles.unitActive : ""}`}
              onClick={() => setUnit("in")}
            >
              Inches (&quot;)
            </button>
            <button
              className={`${styles.unitBtn} ${unit === "cm" ? styles.unitActive : ""}`}
              onClick={() => setUnit("cm")}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest ({unit === "in" ? "Inches" : "CM"})</th>
                <th>Body Length ({unit === "in" ? "Inches" : "CM"})</th>
                <th>Recommended Height</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <tr key={row.size}>
                  <td className={styles.sizeCell}>
                    <span className={styles.sizeBadge}>{row.size}</span>
                  </td>
                  <td>{unit === "in" ? row.chestIn : row.chestCm}</td>
                  <td>{unit === "in" ? row.lengthIn : row.lengthCm}</td>
                  <td className={styles.recCell}>
                    {row.size === "S" && "5'4\" - 5'6\" (162-168 cm)"}
                    {row.size === "M" && "5'7\" - 5'9\" (170-175 cm)"}
                    {row.size === "L" && "5'10\" - 6'0\" (178-183 cm)"}
                    {row.size === "XL" && "6'0\" - 6'2\" (183-188 cm)"}
                    {row.size === "XXL" && "6'2\"+ (188+ cm)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips Box */}
        <div className={styles.tipsBox}>
          <h4 className={styles.tipsTitle}>
            <CheckIcon size={16} /> Fit Advice from Our Stylists:
          </h4>
          <ul className={styles.tipsList}>
            <li>
              <strong>Fan Version:</strong> Cut for standard everyday comfort. If you prefer a relaxed fit, order your normal size.
            </li>
            <li>
              <strong>Player Issue Edition:</strong> Tapered athletic fit as worn on-pitch. If you prefer a loose look, we recommend sizing up one size.
            </li>
            <li>
              <strong>Hassle-Free Exchange:</strong> If the size doesn&apos;t fit, exchange within 7 days anywhere in Bangladesh.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
