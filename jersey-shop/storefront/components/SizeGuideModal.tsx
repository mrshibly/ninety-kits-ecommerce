"use client";

import React, { useState } from "react";
import {
  CloseIcon,
  RulerIcon,
  CheckIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BadgeCheckIcon,
} from "@/components/Icons";
import styles from "./SizeGuideModal.module.css";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [editionTab, setEditionTab] = useState<"fan" | "player" | "youth">("fan");
  const [calcHeight, setCalcHeight] = useState<string>("5'7\" - 5'9\"");
  const [calcWeight, setCalcWeight] = useState<string>("65 - 75 kg");

  if (!isOpen) return null;

  const fanData = [
    { size: "S", chestIn: '36" - 38"', lengthIn: '27"', chestCm: "91 - 97 cm", lengthCm: "69 cm", sleeveIn: '8.5"', sleeveCm: "21.5 cm", height: "5'4\" - 5'6\"", weight: "52 - 62 kg" },
    { size: "M", chestIn: '38" - 40"', lengthIn: '28"', chestCm: "97 - 102 cm", lengthCm: "71 cm", sleeveIn: '9.0"', sleeveCm: "23.0 cm", height: "5'7\" - 5'9\"", weight: "63 - 73 kg" },
    { size: "L", chestIn: '40" - 42"', lengthIn: '29"', chestCm: "102 - 107 cm", lengthCm: "74 cm", sleeveIn: '9.5"', sleeveCm: "24.0 cm", height: "5'10\" - 6'0\"", weight: "74 - 84 kg" },
    { size: "XL", chestIn: '42" - 44"', lengthIn: '30"', chestCm: "107 - 112 cm", lengthCm: "76 cm", sleeveIn: '10.0"', sleeveCm: "25.5 cm", height: "6'0\" - 6'2\"", weight: "85 - 94 kg" },
    { size: "XXL", chestIn: '44" - 46"', lengthIn: '31"', chestCm: "112 - 117 cm", lengthCm: "79 cm", sleeveIn: '10.5"', sleeveCm: "26.5 cm", height: "6'2\" - 6'4\"", weight: "95 - 105 kg" },
    { size: "3XL", chestIn: '46" - 48"', lengthIn: '32"', chestCm: "117 - 122 cm", lengthCm: "81 cm", sleeveIn: '11.0"', sleeveCm: "28.0 cm", height: "6'3\"+", weight: "105+ kg" },
  ];

  const playerData = [
    { size: "S", chestIn: '34" - 36"', lengthIn: '27"', chestCm: "86 - 91 cm", lengthCm: "69 cm", sleeveIn: '8.5"', sleeveCm: "21.5 cm", height: "5'4\" - 5'6\"", weight: "48 - 58 kg" },
    { size: "M", chestIn: '36" - 38"', lengthIn: '28"', chestCm: "91 - 97 cm", lengthCm: "71 cm", sleeveIn: '9.0"', sleeveCm: "23.0 cm", height: "5'7\" - 5'9\"", weight: "59 - 69 kg" },
    { size: "L", chestIn: '38" - 40"', lengthIn: '29"', chestCm: "97 - 102 cm", lengthCm: "74 cm", sleeveIn: '9.5"', sleeveCm: "24.0 cm", height: "5'10\" - 6'0\"", weight: "70 - 80 kg" },
    { size: "XL", chestIn: '40" - 42"', lengthIn: '30"', chestCm: "102 - 107 cm", lengthCm: "76 cm", sleeveIn: '10.0"', sleeveCm: "25.5 cm", height: "6'0\" - 6'2\"", weight: "81 - 90 kg" },
    { size: "XXL", chestIn: '42" - 44"', lengthIn: '31"', chestCm: "107 - 112 cm", lengthCm: "79 cm", sleeveIn: '10.5"', sleeveCm: "26.5 cm", height: "6'2\" - 6'4\"", weight: "91 - 100 kg" },
  ];

  const youthData = [
    { size: "Y-S (22)", chestIn: '28" - 30"', lengthIn: '20"', chestCm: "71 - 76 cm", lengthCm: "51 cm", sleeveIn: '6.0"', sleeveCm: "15.0 cm", height: "3'8\" - 4'1\"", weight: "22 - 28 kg" },
    { size: "Y-M (24)", chestIn: '30" - 32"', lengthIn: '22"', chestCm: "76 - 81 cm", lengthCm: "56 cm", sleeveIn: '6.5"', sleeveCm: "16.5 cm", height: "4'2\" - 4'6\"", weight: "29 - 36 kg" },
    { size: "Y-L (26)", chestIn: '32" - 34"', lengthIn: '24"', chestCm: "81 - 86 cm", lengthCm: "61 cm", sleeveIn: '7.0"', sleeveCm: "18.0 cm", height: "4'7\" - 4'11\"", weight: "37 - 44 kg" },
    { size: "Y-XL (28)", chestIn: '34" - 36"', lengthIn: '26"', chestCm: "86 - 91 cm", lengthCm: "66 cm", sleeveIn: '7.5"', sleeveCm: "19.0 cm", height: "5'0\" - 5'3\"", weight: "45 - 52 kg" },
  ];

  const currentData =
    editionTab === "fan" ? fanData : editionTab === "player" ? playerData : youthData;

  // Simple sizing recommendation
  const getRecommendedSize = () => {
    if (editionTab === "youth") return "Y-M (24)";
    if (calcHeight.includes("5'4") || calcWeight.includes("55")) return "S";
    if (calcHeight.includes("5'7") || calcHeight.includes("5'8") || calcWeight.includes("65")) {
      return editionTab === "player" ? "L (Player Issue runs snug)" : "M";
    }
    if (calcHeight.includes("5'10") || calcHeight.includes("6'0") || calcWeight.includes("75")) {
      return editionTab === "player" ? "XL" : "L";
    }
    return "XL";
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header Canopy */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <div className={styles.iconCircle}>
              <RulerIcon size={20} />
            </div>
            <div>
              <div className={styles.badgeRow}>
                <span className={styles.matrixBadge}>OFFICIAL SPECIFICATIONS</span>
                <span className={styles.bdStandardTag}>BANGLADESH &amp; GLOBAL STANDARD</span>
              </div>
              <h3 className={styles.title}>NINETY KITS™ Official Sizing Matrix</h3>
              <p className={styles.subtitle}>
                Precision tournament measurements for all club &amp; national kits
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close size guide"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Interactive Fit Recommender Strip */}
        <div className={styles.recommenderCard}>
          <div className={styles.recommenderHeader}>
            <div className={styles.recTitleLeft}>
              <SparklesIcon size={16} />
              <strong>INTERACTIVE FIT CALCULATOR</strong>
            </div>
            <span className={styles.recResultTag}>
              RECOMMENDED: <strong>{getRecommendedSize()}</strong>
            </span>
          </div>

          <div className={styles.recSelectorsRow}>
            <div className={styles.recField}>
              <label>YOUR HEIGHT</label>
              <select
                value={calcHeight}
                onChange={(e) => setCalcHeight(e.target.value)}
                className={styles.recSelect}
              >
                <option value="5'0&quot; - 5'3&quot;">5&apos;0&quot; - 5&apos;3&quot; (152 - 160 cm)</option>
                <option value="5'4&quot; - 5'6&quot;">5&apos;4&quot; - 5&apos;6&quot; (162 - 168 cm)</option>
                <option value="5'7&quot; - 5'9&quot;">5&apos;7&quot; - 5&apos;9&quot; (170 - 175 cm)</option>
                <option value="5'10&quot; - 6'0&quot;">5&apos;10&quot; - 6&apos;0&quot; (178 - 183 cm)</option>
                <option value="6'1&quot; - 6'3&quot;">6&apos;1&quot; - 6&apos;3&quot; (185 - 190 cm)</option>
                <option value="6'4&quot;+">6&apos;4&quot;+ (193+ cm)</option>
              </select>
            </div>

            <div className={styles.recField}>
              <label>YOUR BODY WEIGHT</label>
              <select
                value={calcWeight}
                onChange={(e) => setCalcWeight(e.target.value)}
                className={styles.recSelect}
              >
                <option value="45 - 55 kg">45 - 55 kg (Slim / Light)</option>
                <option value="56 - 65 kg">56 - 65 kg (Athletic Lean)</option>
                <option value="65 - 75 kg">65 - 75 kg (Standard Regular)</option>
                <option value="76 - 85 kg">76 - 85 kg (Athletic Muscular)</option>
                <option value="86 - 95 kg">86 - 95 kg (Broad Build)</option>
                <option value="96+ kg">96+ kg (Heavyweight)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Edition & Unit Controls */}
        <div className={styles.controls}>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tabBtn} ${editionTab === "fan" ? styles.tabActive : ""}`}
              onClick={() => setEditionTab("fan")}
            >
              Fan Version (Regular Match Fit)
            </button>
            <button
              className={`${styles.tabBtn} ${editionTab === "player" ? styles.tabActive : ""}`}
              onClick={() => setEditionTab("player")}
            >
              Player Issue (Athletic Slim Fit)
            </button>
            <button
              className={`${styles.tabBtn} ${editionTab === "youth" ? styles.tabActive : ""}`}
              onClick={() => setEditionTab("youth")}
            >
              Youth / Kids Academy
            </button>
          </div>

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

        {/* Sizing Table Matrix */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SIZE</th>
                <th>CHEST WIDTH ({unit === "in" ? "INCHES" : "CM"})</th>
                <th>BODY LENGTH ({unit === "in" ? "INCHES" : "CM"})</th>
                <th>SLEEVE SPAN ({unit === "in" ? "INCHES" : "CM"})</th>
                <th>REC. HEIGHT</th>
                <th>REC. WEIGHT</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row) => (
                <tr key={row.size}>
                  <td className={styles.sizeCell}>
                    <span className={styles.sizeBadge}>{row.size}</span>
                  </td>
                  <td className={styles.measureVal}>{unit === "in" ? row.chestIn : row.chestCm}</td>
                  <td className={styles.measureVal}>{unit === "in" ? row.lengthIn : row.lengthCm}</td>
                  <td className={styles.measureVal}>{unit === "in" ? row.sleeveIn : row.sleeveCm}</td>
                  <td className={styles.recCell}>{row.height}</td>
                  <td className={styles.recCell}>{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Guide & Advice Cards */}
        <div className={styles.guideGrid}>
          {/* How to Measure */}
          <div className={styles.measureGuideBox}>
            <h4 className={styles.guideTitle}>
              <RulerIcon size={16} /> HOW TO MEASURE YOUR JERSEY
            </h4>
            <div className={styles.measureSteps}>
              <div className={styles.stepRow}>
                <span className={styles.stepNum}>A</span>
                <div>
                  <strong>Chest Width:</strong>
                  <p>Measure across the fullest part of your chest, 1 inch below armpits, keeping tape flat.</p>
                </div>
              </div>
              <div className={styles.stepRow}>
                <span className={styles.stepNum}>B</span>
                <div>
                  <strong>Body Length:</strong>
                  <p>Measure from the highest point of the shoulder seam straight down to the bottom hemline.</p>
                </div>
              </div>
              <div className={styles.stepRow}>
                <span className={styles.stepNum}>C</span>
                <div>
                  <strong>Sleeve Length:</strong>
                  <p>Measure from the top shoulder seam down to the outer cuff edge.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fit Advice & Exchange Guarantee */}
          <div className={styles.fitAdviceBox}>
            <h4 className={styles.adviceTitle}>
              <BadgeCheckIcon size={16} /> 7-DAY NATIONWIDE EXCHANGE
            </h4>
            <ul className={styles.adviceList}>
              <li>
                <strong>Fan Version (Stadium Fit):</strong> Engineered for everyday lifestyle comfort. True to regular Bangladeshi T-shirt sizing.
              </li>
              <li>
                <strong>Player Issue (Match Fit):</strong> Tapered performance cut. If you have broad shoulders or prefer relaxed drape, <em>size up one size</em>.
              </li>
              <li>
                <strong>Risk-Free Exchanges:</strong> If your ordered kit doesn&apos;t fit your frame, request an instant size swap within 7 days via Pathao anywhere in Bangladesh.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
