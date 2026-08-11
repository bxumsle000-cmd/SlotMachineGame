package com.poz.SlotMachine.engine;

import java.util.*;

public class Reel {
    // 標準寫法：介面型別 Map，實作用 HashMap
    private static final Map<String, Integer> reelConfig = new LinkedHashMap<>();

    static {
        reelConfig.put("Blank", 4);
        reelConfig.put("Cherry", 11);
        reelConfig.put("Lemon", 11);
        reelConfig.put("BAR", 6);
        reelConfig.put("Seven", 6);
        reelConfig.put("Wild", "1");
        }


    private static List<String> bulidStrip(){
        List<List<String>> buckets = new ArrayList<>();
        reelConfig.forEach((sym,cnt) -> buckets.add(Collections.nCopies(cnt,sym)));
        int maxReelCount = Collections.max(reelConfig.values());
        List<String> Symbols = new ArrayList<>();
        for (int i=0; i<maxReelCount; i++){
            for(List<String> bucket : buckets){
                if(bucket.size()>i){
                Symbols.add(bucket.get(i));
            }
            }
        }
        return Symbols;
    }

    public static final Set<String> symbolType =  reelConfig.keySet();

    public static final  List<List<String>> reelStrips = List.of(
    bulidStrip(),bulidStrip(),bulidStrip(),bulidStrip(),bulidStrip()
            );
}