package com.poz.SlotMachine.service;

import com.poz.SlotMachine.constant.BetConfig;
import com.poz.SlotMachine.engine.Spin;
import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.MemberWallet;
import com.poz.SlotMachine.model.SpinResponse;
import com.poz.SlotMachine.model.SpinResults;
import com.poz.SlotMachine.repository.MemberWalletRepository;
import com.poz.SlotMachine.repository.SpinHistoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class GameService {
    private  final Spin spin ;
    private  final MemberWalletRepository memberWalletRepository;
    private  final SpinHistoryRepository spinHistoryRepository;

    public GameService(Spin spin, MemberWalletRepository memberWalletRepository, SpinHistoryRepository spinHistoryRepository) {
        this.spin = spin;
        this.memberWalletRepository = memberWalletRepository;
        this.spinHistoryRepository = spinHistoryRepository;
    }

    public int getUserBalance(int memberID){
        Optional<MemberWallet> memberWallet = memberWalletRepository.getMemberWallet(memberID);
        if(memberWallet.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "找不到會員錢包");
        }
        int balance = memberWallet.get().balance();
        return balance ;
    }

    @Transactional
    public SpinResponse dospin(int memberID, int betAmount){
        if(getUserBalance(memberID)<0){
            throw new ApiException(HttpStatus.BAD_REQUEST, "餘額不能為負數");
        }
        if (betAmount < BetConfig.MinBet){
            throw new ApiException(HttpStatus.BAD_REQUEST, "下注金額必須大於或等於50");
        }
        if (betAmount > BetConfig.MaxBet){
            throw new ApiException(HttpStatus.BAD_REQUEST, "下注金額必須小於或等於500");
        }
        if (betAmount %50 !=0){
            throw new ApiException(HttpStatus.BAD_REQUEST, "下注金額必須為50的倍數");
        }

        SpinResults spinResults = spin.spinonce();
        Optional<MemberWallet> memberWallet = memberWalletRepository.getMemberWallet(memberID);
        if(memberWallet.isEmpty()){
            throw new ApiException(HttpStatus.NOT_FOUND, "找不到會員錢包");
        }

        int InitialBalance = memberWallet.get().balance();
        if( InitialBalance < betAmount ){
            throw new ApiException(HttpStatus.BAD_REQUEST, "餘額不足");
        }

        memberWalletRepository.balanceChange(memberID,-betAmount);
        int winAmount =  betAmount * spinResults.totalMultiplier() /5 ;
        memberWalletRepository.balanceChange(memberID,winAmount);
        int finalBalance = InitialBalance-betAmount + winAmount;

        spinHistoryRepository.insertNewHistory(memberID,betAmount,winAmount,
                InitialBalance,finalBalance,spinResults.totalMultiplier());

        return new SpinResponse(winAmount,spinResults.grid(),spinResults.winPayable());
    }
}
