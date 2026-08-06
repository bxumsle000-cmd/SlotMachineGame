package com.poz.SlotMachine.constant;

import com.poz.SlotMachine.model.Paytable;

import java.util.List;

public class PayableConfig {
    // payline (0->第一行 1->第二行 2->第三行)
    public static final List<List<Integer>> Paylines = List.of(
            List.of(0, 0, 0, 0, 0),
            List.of(1, 1, 1, 1, 1),
            List.of(2, 2, 2, 2, 2),
            List.of(0, 1, 2, 1, 0),
            List.of(2, 1, 0, 1, 2)
    );

    // 賠率表
    public static final List<Paytable> Paytables = List.of(
            new Paytable("Seven", 5, 500),
            new Paytable("Seven", 4, 100),
            new Paytable("BAR", 5, 100),
            new Paytable("Seven", 3, 50),
            new Paytable("Cherry", 5, 50),
            new Paytable("BAR", 4, 25),
            new Paytable("Lemon", 5, 25),
            new Paytable("BAR", 3, 10),
            new Paytable("Cherry", 4, 10),
            new Paytable("Cherry", 3, 5),
            new Paytable("Lemon", 4, 5),
            new Paytable("Lemon", 3, 3)
    );

}
