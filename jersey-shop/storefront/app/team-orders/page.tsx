"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useStoreData } from "@/lib/context/StoreDataContext";
import {
  UsersIcon,
  PlusIcon,
  CloseIcon,
  CheckCircleIcon,
  TagIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from "@/components/Icons";
import styles from "./team-orders.module.css";

interface RosterPlayer {
  id: string;
  name: string;
  number: string;
  size: string;
  isCaptain: boolean;
}

const DEFAULT_ROSTER: RosterPlayer[] = [
  { id: "1", name: "TANVIR", number: "10", size: "L", isCaptain: true },
  { id: "2", name: "RAKIB", number: "7", size: "M", isCaptain: false },
  { id: "3", name: "SABBIR", number: "9", size: "XL", isCaptain: false },
  { id: "4", name: "FAHIM", number: "4", size: "L", isCaptain: false },
  { id: "5", name: "IMTIAZ", number: "1", size: "XXL", isCaptain: false },
];

export default function TeamOrdersPage() {
  const { addItem } = useCart();
  const router = useRouter();
  const { products } = useStoreData();

  const [teamName, setTeamName] = useState("Dhanmondi Strikers FC");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [roster, setRoster] = useState<RosterPlayer[]>(DEFAULT_ROSTER);
  const [addedAll, setAddedAll] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const addPlayerRow = () => {
    const nextNum = (roster.length + 1).toString();
    setRoster((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        number: nextNum,
        size: "L",
        isCaptain: false,
      },
    ]);
  };

  const removePlayerRow = (id: string) => {
    if (roster.length <= 1) return;
    setRoster((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, field: keyof RosterPlayer, value: any) => {
    setRoster((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Bulk Discount calculation
  const totalKits = roster.length;
  let discountRate = 0;
  if (totalKits >= 20) {
    discountRate = 0.20; // 20%
  } else if (totalKits >= 10) {
    discountRate = 0.15; // 15%
  } else if (totalKits >= 5) {
    discountRate = 0.05; // 5%
  }

  const basePricePerKit = selectedProduct.price + 200; // kit + custom printing
  const rawSubtotal = basePricePerKit * totalKits;
  const discountAmount = Math.round(rawSubtotal * discountRate);
  const teamTotal = rawSubtotal - discountAmount;

  const handleAddAllToCart = () => {
    roster.forEach((player) => {
      addItem({
        productId: selectedProduct.id,
        name: `${selectedProduct.name} [${teamName || "Team Order"}]`,
        slug: selectedProduct.slug,
        price: basePricePerKit - Math.round(basePricePerKit * discountRate),
        currency: selectedProduct.currency,
        image: selectedProduct.images[0],
        size: player.size,
        quantity: 1,
        customName: player.name.toUpperCase() || "PLAYER",
        customNumber: player.number || "00",
        team: teamName || selectedProduct.team,
      });
    });

    setAddedAll(true);
    setTimeout(() => {
      router.push("/cart");
    }, 800);
  };

  return (
    <div className={styles.page}>
      {/* Hero Header */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.teamBadge}>
              <UsersIcon size={16} />
              <span>Special Team Discounts</span>
            </div>
            <h1 className={styles.title}>Order Matching Jerseys for Your Team</h1>
            <p className={styles.desc}>
              Ordering for your team, academy, or tournament? Enter player names, numbers, and sizes in the list below. We automatically calculate your bulk discount and fast-track your order.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: "80px" }}>
        {/* Tiered Discount Banner */}
        <div className={styles.tierGrid}>
          <div className={`${styles.tierCard} ${totalKits < 5 ? styles.tierActive : ""}`}>
            <span className={styles.tierCount}>1 - 4 Jerseys</span>
            <strong>Standard Price</strong>
            <span>Regular rate</span>
          </div>

          <div className={`${styles.tierCard} ${totalKits >= 5 && totalKits < 10 ? styles.tierActive : ""}`}>
            <span className={styles.tierCount}>5 - 9 Jerseys</span>
            <strong>5% Discount</strong>
            <span>Small team savings</span>
          </div>

          <div className={`${styles.tierCard} ${totalKits >= 10 && totalKits < 20 ? styles.tierActive : ""}`}>
            <span className={styles.tierCount}>10 - 19 Jerseys</span>
            <strong>15% Discount</strong>
            <span>+ Free Captain Armband</span>
          </div>

          <div className={`${styles.tierCard} ${totalKits >= 20 ? styles.tierActive : ""}`}>
            <span className={styles.tierCount}>20+ Jerseys</span>
            <strong>20% Discount</strong>
            <span>+ Free Team Logo Print</span>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Left Form: Team Info & Roster Builder */}
          <div className={styles.rosterSection}>
            <div className={styles.setupCard}>
              <h3>1. Team Details</h3>
              <div className={styles.setupRow}>
                <div className={styles.field}>
                  <label htmlFor="team-name">Team / Club Name *</label>
                  <input
                    type="text"
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Dhanmondi Strikers FC"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="kit-select">Choose Jersey Design *</label>
                  <select
                    id="kit-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className={styles.select}
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (৳{prod.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Roster Table */}
            <div className={styles.rosterTableCard}>
              <div className={styles.rosterTableHeader}>
                <div>
                  <h3>2. Players List ({roster.length} Players)</h3>
                  <span>Enter name, number, and size for each player</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addPlayerRow}
                >
                  <PlusIcon size={16} />
                  <span>Add Player</span>
                </button>
              </div>

              <div className={styles.rosterTableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>#</th>
                      <th>Name on Jersey</th>
                      <th style={{ width: "100px" }}>Number</th>
                      <th style={{ width: "110px" }}>Size</th>
                      <th style={{ width: "110px" }}>Role</th>
                      <th style={{ width: "50px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((player, idx) => (
                      <tr key={player.id}>
                        <td className={styles.indexCell}>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            placeholder="e.g. TANVIR"
                            value={player.name}
                            onChange={(e) =>
                              updatePlayer(player.id, "name", e.target.value.toUpperCase())
                            }
                            className={styles.rosterInput}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="10"
                            value={player.number}
                            onChange={(e) =>
                              updatePlayer(player.id, "number", e.target.value.replace(/\D/g, "").slice(0, 2))
                            }
                            className={styles.rosterInput}
                          />
                        </td>
                        <td>
                          <select
                            value={player.size}
                            onChange={(e) => updatePlayer(player.id, "size", e.target.value)}
                            className={styles.rosterSelect}
                          >
                            <option value="S">S (36&quot;)</option>
                            <option value="M">M (38&quot;)</option>
                            <option value="L">L (40&quot;)</option>
                            <option value="XL">XL (42&quot;)</option>
                            <option value="XXL">XXL (44&quot;)</option>
                          </select>
                        </td>
                        <td>
                          <label className={styles.captainToggle}>
                            <input
                              type="checkbox"
                              checked={player.isCaptain}
                              onChange={(e) => updatePlayer(player.id, "isCaptain", e.target.checked)}
                            />
                            <span>{player.isCaptain ? "Captain (C)" : "Player"}</span>
                          </label>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.deleteRowBtn}
                            onClick={() => removePlayerRow(player.id)}
                            aria-label="Remove player"
                          >
                            <CloseIcon size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Team Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Selected Base Kit:</span>
                <strong>{selectedProduct.name}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Squad Quantity:</span>
                <strong>{totalKits} Customized Jerseys</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Base Unit Price:</span>
                <span>৳{basePricePerKit.toLocaleString()} / kit</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Raw Subtotal:</span>
                <span>৳{rawSubtotal.toLocaleString()}</span>
              </div>

              {discountRate > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>
                    Bulk Discount ({(discountRate * 100).toFixed(0)}% OFF):
                  </span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Estimated Nationwide Delivery:</span>
                <span className={styles.freeShippingTag}>FREE (Over ৳5,000)</span>
              </div>

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total Payable:</span>
                <strong className={styles.grandTotal}>৳{teamTotal.toLocaleString()}</strong>
              </div>

              <button
                type="button"
                className={`btn btn-primary btn-lg ${styles.addCartBtn}`}
                onClick={handleAddAllToCart}
                disabled={addedAll}
                id="add-team-roster-btn"
              >
                <ShoppingBagIcon size={20} />
                <span>{addedAll ? "Adding Squad Roster..." : `Add ${totalKits} Kits to Cart`}</span>
              </button>

              <div className={styles.teamGuarantees}>
                <div className={styles.guaranteeRow}>
                  <CheckCircleIcon size={16} />
                  <span>Free Roster Alignment Proofing</span>
                </div>
                <div className={styles.guaranteeRow}>
                  <CheckCircleIcon size={16} />
                  <span>Individual Bagging per Player</span>
                </div>
                <div className={styles.guaranteeRow}>
                  <ShieldCheckIcon size={16} />
                  <span>24-48 Hour Tournament Priority Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
