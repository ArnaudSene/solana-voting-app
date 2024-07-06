use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("HJUsspPBYBYNBQxDAkozYrVgds5BuZVbw4iKofHwdZ7Q");

const MAX_CHOICES: usize = 10;

#[program]
mod hello_anchor {
    use super::*;

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        choices: Vec<String>,
        deadline: u64,
    ) -> Result<()> {
        require!(ctx.accounts.proposal.choices.len() as u8 <= 10, VoteError::TooManyChoices);

        let proposal_account = &mut ctx.accounts.proposal;
        proposal_account.title = title;
        proposal_account.description = description;
        proposal_account.deadline = deadline;

        let mut _choices: Vec<Choice> = Vec::new();

        for choice in choices {
            let _choice = Choice {
                label: choice,
                count: 0,
            };

            _choices.push(_choice);
        }
        
        proposal_account.choices = _choices;

        Ok(())
    }

    pub fn vote(ctx: Context<CastVote>, choice_index: u8) -> Result<()> {
        require!(
            Clock::get()?.unix_timestamp < ctx.accounts.proposal.deadline as i64, 
            VoteError::ProposalIsOver
        );

        require!(
            ctx.accounts.proposal.choices.len() as u8> choice_index, 
            VoteError::ChoiceIndexOutOfScope
        );
        
        let proposal_account = &mut ctx.accounts.proposal;
        let voter_account = &mut ctx.accounts.voter;

        proposal_account.choices[choice_index as usize].count += 1;

        voter_account.choice_index = choice_index;
        voter_account.proposal = proposal_account.key();
        voter_account.user = ctx.accounts.signer.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    // space
    //
    // discriminator => 8
    // title => 32
    // description => 32
    // choices => en fonction du nombre de choice maximum, ex 5 => 5 x (choice)
    //      Choice
    //          label => 32
    //          count => 8
    // deadline => 8
    #[account(init, payer = signer, space = 8 + 32 + 32 + (32 + 8) * MAX_CHOICES + 8)]
    pub proposal: Account<'info, Proposal>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,
    
    // create a pda
    // addr proposal + addr user
    #[account(init, payer = signer, space = 8 + 32 + 32 + 1 + 1, seeds=[proposal.key().as_ref(), signer.key().as_ref()], bump)]
    pub voter: Account<'info, Voter>,
    
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
pub struct Proposal {
    title: String,
    description: String,
    choices: Vec<Choice>,
    deadline: u64,
}

#[account]
pub struct Voter {
    proposal: Pubkey,
    user: Pubkey,
    choice_index: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Choice {
    label: String,
    count: u64,
}

#[error_code]
pub enum VoteError {
    #[msg("Too many choices!")]
    TooManyChoices,
    #[msg("Proposal is closed!")]
    ProposalIsOver,
    #[msg("Choice index invalid!")]
    ChoiceIndexOutOfScope,

}