package com.poz.SlotMachine.model;

import java.util.List;

/**
 * 一次 spin 的結果。
 *
 * @param winAmount  本局贏得的金額
 * @param balance    這一局結算後的餘額（由後端算好，前端直接顯示，不必自己再算一次）
 * @param grid       盤面，grid[列][欄]
 * @param winPayable 中獎明細
 */
public record SpinResponse(
        int winAmount, int balance, List<List<String>> grid , List<Paytable> winPayable
) {
}
