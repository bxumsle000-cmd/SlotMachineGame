package com.poz.SlotMachine.engine;

import com.poz.SlotMachine.model.Paytable;
import com.poz.SlotMachine.model.SpinResults;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static com.poz.SlotMachine.constant.PayableConfig.Paylines;
import static com.poz.SlotMachine.engine.Evaluation.findBestRule;
import static com.poz.SlotMachine.engine.Reel.reelStrips;

public class Spin {

    public SpinResults spin(){
        List<List<String>> window = reelWindows();
        List<List<String>> gird = windowToGrid(window);
        List<List<String>> combos = getPaylineCombos(gird);

        int totalMultiplier = 0;
        List<Paytable> winPayable = new ArrayList<>();

        for (List<String> combo: combos){
            Paytable payableRule = findBestRule(combo);
            if(payableRule!=null){
                totalMultiplier+= payableRule.multiplier();
                winPayable.add(payableRule);
            }
        }
        return  new SpinResults(totalMultiplier, gird, winPayable);
    }

    private List<List<String>> reelWindows (){
        Random rand = new Random();
        List<List<String>>  windowAll =new ArrayList<>();
        for(List<String> strip : reelStrips){
            int stop = rand.nextInt(strip.size());
            List<String> window =new ArrayList<>();
            for(int i = 0 ; i<3 ; i++){
                window.add(strip.get((stop+i) % strip.size()));
            }
            windowAll.add(window);
        }
    return  windowAll ;
    }

    private List<List<String>> windowToGrid(List<List<String>> windows) {
        int rows = windows.size();
        int cols = windows.get(0).size();
        List<List<String>> grid =new ArrayList<>();
        for (int c = 0 ; c<cols ; c++){
            List<String> newrows = new ArrayList<>();
            for (int r = 0 ; r<rows ; r++){
                newrows.add(windows.get(c).get(r));
            }
            grid.add(newrows);
        }
    return grid ;
    }

    private List<List<String>>  getPaylineCombos(List<List<String>> grid){
        List<List<String>> combosAll = new ArrayList<>();
        for(List<Integer> line :Paylines){
            List<String> combo =  new ArrayList<>();
            for(int i=0; i<5 ; i++){
                int row = line.get(i);
                int col = i;
                combo.add(grid.get(row).get(col));
            }
            combosAll.add(combo);
        }
    return  combosAll ;
    }

}
