package com.poz.SlotMachine.service;

import com.poz.SlotMachine.engine.Spin;
import com.poz.SlotMachine.model.MemberWallet;
import com.poz.SlotMachine.model.SpinResponse;
import com.poz.SlotMachine.model.SpinResults;
import com.poz.SlotMachine.repository.MemberWalletRepository;
import com.poz.SlotMachine.repository.SpinHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SpinService {
    private  final Spin spin ;
    private  final MemberWalletRepository memberWalletRepository;
    private  final SpinHistoryRepository spinHistoryRepository;

    private int memberID = 1 ;

    public SpinService(Spin spin, MemberWalletRepository memberWalletRepository, SpinHistoryRepository spinHistoryRepository) {
        this.spin = spin;
        this.memberWalletRepository = memberWalletRepository;
        this.spinHistoryRepository = spinHistoryRepository;
    }

    public SpinResponse dospin(int betAmount){
        SpinResults spinResults = spin.spinonce();
        Optional<MemberWallet> menberWallet = memberWalletRepository.getMenberWallet(memberID);
        int InitialBalance = menberWallet.get().balance();
        memberWalletRepository.balanceChange(memberID,-betAmount);
        int winAmount =  betAmount * spinResults.totalMultiplier() /5 ;
        memberWalletRepository.balanceChange(memberID,winAmount);
        int finalBalance = InitialBalance-betAmount + winAmount;

        spinHistoryRepository.insertNewHistory(memberID,betAmount,winAmount,
                InitialBalance,finalBalance,spinResults.totalMultiplier());

        return new SpinResponse();
    }
}
