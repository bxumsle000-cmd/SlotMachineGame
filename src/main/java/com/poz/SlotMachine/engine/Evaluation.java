package com.poz.SlotMachine.engine;

import com.poz.SlotMachine.model.Paytable;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.poz.SlotMachine.constant.PayableConfig.Paytables;
import static com.poz.SlotMachine.engine.Reel.symbolType;

// 處理combo
public class Evaluation {
    private static Paytable findMatchRule(List<String> combo){
       for(Paytable rule : Paytables){
           boolean match = combo.stream().limit(rule.count()).allMatch(s-> s.equals(rule.symbol()));
           if (match){
               return rule;
           }
       }
        return null;
    }

    private static List<String> replaceWild(List<String> combo){
        if(!combo.contains("Wild")){
            return combo;
        }

        int bestMultiplier = 0;
        List<String> bestCombo = combo;

        for(String symbol: symbolType){
            List<String> candidate = combo.stream().map(s-> s.equals("Wild")? symbol:s).toList();
            Paytable rule = findMatchRule(candidate);
            if (rule!=null && rule.multiplier()>bestMultiplier){
                bestCombo = candidate;
                bestMultiplier = rule.multiplier();
            }
        }
        return bestCombo;
    }

    public static Paytable findBestRule(List<String> combo){
        List<String> resolvedCombo = replaceWild(combo);
        Paytable bestRule = findMatchRule(resolvedCombo);
        return  bestRule;
    }
}